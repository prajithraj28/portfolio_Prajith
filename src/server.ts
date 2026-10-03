import "./lib/error-capture";

import { Resend } from "resend";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { validateContactForm } from "./lib/contact-form";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

type CloudflareContactEnv = {
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  CONTACT_TO?: string;
};

const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
} as const;

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    const url = new URL(request.url);

    if (url.pathname === "/api/contact") {
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: JSON_HEADERS });
      }

      if (request.method !== "POST") {
        return new Response(JSON.stringify({ success: false, error: "Method not allowed." }), {
          status: 405,
          headers: JSON_HEADERS,
        });
      }

      let payload: Record<string, unknown>;
      try {
        payload = (await request.json()) as Record<string, unknown>;
      } catch {
        return new Response(JSON.stringify({ success: false, error: "Invalid JSON payload." }), {
          status: 400,
          headers: JSON_HEADERS,
        });
      }

      const validation = validateContactForm({
        name: typeof payload["name"] === "string" ? payload["name"].trim() : "",
        email: typeof payload["email"] === "string" ? payload["email"].trim() : "",
        message: typeof payload["message"] === "string" ? payload["message"].trim() : "",
      });

      if (!validation.ok) {
        return new Response(JSON.stringify({ success: false, error: validation.error }), {
          status: 400,
          headers: JSON_HEADERS,
        });
      }

      const cloudflareEnv = env as CloudflareContactEnv | undefined;
      const apiKey = cloudflareEnv?.RESEND_API_KEY?.trim() || process.env["RESEND_API_KEY"]?.trim();
      const from = cloudflareEnv?.RESEND_FROM?.trim() || process.env["RESEND_FROM"]?.trim() || "onboarding@resend.dev";
      const to = cloudflareEnv?.CONTACT_TO?.trim() || process.env["CONTACT_TO"]?.trim() || "kprajithraj@gmail.com";

      if (!apiKey) {
        console.error("RESEND_API_KEY is not configured.");
        return new Response(JSON.stringify({ success: false, error: "Email service is not configured." }), {
          status: 500,
          headers: JSON_HEADERS,
        });
      }

      try {
        const resend = new Resend(apiKey);
        const result = await resend.emails.send({
          from,
          to: [to],
          replyTo: typeof payload["email"] === "string" ? payload["email"].trim() : "",
          subject: `Portfolio message from ${String(payload["name"]).trim()}`,
          text: `Visitor Name: ${String(payload["name"]).trim()}\nVisitor Email: ${String(payload["email"]).trim()}\n\nMessage:\n${String(payload["message"]).trim()}`,
          html: `
            <p><strong>Visitor Name:</strong> ${escapeHtml(String(payload["name"]).trim())}</p>
            <p><strong>Visitor Email:</strong> ${escapeHtml(String(payload["email"]).trim())}</p>
            <p><strong>Message:</strong></p>
            <p>${escapeHtml(String(payload["message"]).trim()).replace(/\n/g, "<br />")}</p>
          `,
        });

        if ((result as { error?: { message?: string } }).error) {
          throw new Error((result as { error: { message: string } }).error.message ?? "Email send failed.");
        }

        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: JSON_HEADERS,
        });
      } catch (error) {
        console.error("Contact email failed", error);
        return new Response(JSON.stringify({ success: false, error: "Failed to send message. Please try again." }), {
          status: 500,
          headers: JSON_HEADERS,
        });
      }
    }

    try {
      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
