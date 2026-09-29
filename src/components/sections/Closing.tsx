import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Mail, Linkedin, Github, ArrowUp, X, Image as ImageIcon, Trophy, Medal, Award, ScrollText } from "lucide-react";
import { useRef, useState, type FormEvent } from "react";
import { FadeIn, GhostButton, MonoLabel, PrimaryButton, Tilt, ChipTag } from "@/components/ui/kit";
import { achievements, certifications, journey, profile } from "@/data/portfolio";
import resume from "@/assets/KPrajith_resume.pdf.asset.json";
import { cn } from "@/lib/utils";

const icons = { trophy: Trophy, medal: Medal, badge: Award, plaque: ScrollText };

export function Product() {
  return (
    <section id="product" className="relative z-10 bg-bg2 px-5 py-20 sm:px-8 md:px-10 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
        <FadeIn>
          <MonoLabel index="05">Flagship product</MonoLabel>
          <h2 className="hero-heading mt-3 font-display font-bold uppercase leading-none tracking-tight" style={{ fontSize: "clamp(2.2rem,6vw,84px)" }}>Finding Device</h2>
          <p className="mt-6 max-w-lg text-muted-foreground">[What it does — details coming soon.]</p>
          <div className="mt-6 flex flex-wrap gap-2">{["[Spec 1]", "[Spec 2]", "[Spec 3]", "[Status]"].map((s) => <ChipTag key={s}>{s}</ChipTag>)}</div>
          <GhostButton className="mt-8" href="#contact">Ask About It</GhostButton>
        </FadeIn>
        <FadeIn delay={0.2}>
          <Tilt className="aspect-[4/3] w-full">
            <div className="relative h-full w-full overflow-hidden rounded-[32px] border border-line-strong bg-background">
              <div className="tech-grid absolute inset-0" />
              {[["Enclosure", 0, "var(--line-strong)"], ["PCB", 1, "var(--signal)"], ["Antenna", 2, "var(--rf)"], ["Battery", 3, "var(--warn)"]].map(([l, k, c]) => (
                <motion.div key={l as string} initial={{ y: -60 + (k as number) * 10, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true }} transition={{ delay: (k as number) * 0.2, duration: 0.8 }}
                  className="absolute left-1/2 flex h-[16%] w-[55%] -translate-x-1/2 items-center justify-end rounded-2xl border bg-panel/70 pr-4"
                  style={{ top: `${14 + (k as number) * 19}%`, borderColor: c as string, transform: `translateX(-50%) skewX(-12deg)` }}>
                  <span className="font-mono text-[0.65rem] uppercase tracking-widest text-muted-foreground" style={{ transform: "skewX(12deg)" }}>{l as string}</span>
                </motion.div>
              ))}
            </div>
          </Tilt>
        </FadeIn>
      </div>
    </section>
  );
}

export function Achievements() {
  const [sel, setSel] = useState<number | null>(null);
  return (
    <section id="achievements" className="relative z-10 bg-background px-5 py-20 sm:px-8 md:px-10 md:py-32">
      <FadeIn className="mb-16 text-center"><MonoLabel index="06">Results</MonoLabel><h2 className="hero-heading section-heading mt-3">Achievements</h2></FadeIn>
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4" style={{ perspective: 1400 }}>
        {achievements.map((a, i) => {
          const Icon = icons[a.kind];
          return (
            <FadeIn key={a.title} delay={i * 0.1}>
              <Tilt>
                <button onClick={() => setSel(i)} className="glass group flex h-full w-full flex-col items-center gap-5 rounded-[32px] p-8 text-center transition-colors hover:border-signal/50">
                  <motion.div animate={{ rotateY: [-12, 12, -12] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: i }}
                    className={cn("flex size-24 items-center justify-center rounded-full shadow-2xl", i < 2 ? "metal-gold" : "metal-silver")}>
                    <Icon className="size-10 text-background" strokeWidth={1.6} />
                  </motion.div>
                  <p className="font-display text-2xl font-bold">{a.title}</p>
                  <p className="text-sm text-muted-foreground">{a.detail}</p>
                </button>
              </Tilt>
            </FadeIn>
          );
        })}
      </div>
      <div className="mx-auto mt-10 grid max-w-6xl grid-cols-3 gap-3">
        {["Startup expo 1", "Startup expo 2", "Startup expo 3"].map((l) => (
          <div key={l} className="flex aspect-[16/9] items-center justify-center gap-2 rounded-2xl border border-dashed border-line-strong text-muted-foreground"><ImageIcon className="size-4" /><span className="hidden font-mono text-[0.65rem] uppercase tracking-widest sm:inline">{l}</span></div>
        ))}
      </div>
      <AnimatePresence>
        {sel !== null && (
          <motion.div className="fixed inset-0 z-[80] flex items-center justify-center bg-background/80 p-5 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSel(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal className="relative w-full max-w-lg rounded-[32px] border border-line-strong bg-bg2 p-8">
              <button onClick={() => setSel(null)} aria-label="Close" className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full border border-line"><X className="size-5" /></button>
              <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-line-strong text-muted-foreground"><ImageIcon className="size-5" /></div>
              <p className="mt-6 font-display text-3xl font-bold">{achievements[sel].title}</p>
              <p className="mt-2 text-muted-foreground">{achievements[sel].detail}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

export function Certifications() {
  const row = (items: typeof certifications, reverse = false) => (
    <div className="group flex overflow-hidden">
      <div className="animate-marquee flex gap-3 pr-3 group-hover:[animation-play-state:paused]" style={{ animationDirection: reverse ? "reverse" : "normal" }}>
        {[...items, ...items, ...items].map((c, i) => (
          <div key={i} className="glass flex w-[280px] shrink-0 flex-col justify-between gap-6 rounded-2xl p-5 sm:w-[320px]">
            <div className="flex items-start justify-between gap-3">
              <ScrollText className="size-5 text-muted-foreground" />
              {c.embedded && <span className="rounded-full bg-signal/15 px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest text-signal">Embedded</span>}
            </div>
            <div><p className="font-display text-lg font-medium leading-tight">{c.name}</p><p className="mono-label mt-1">{c.issuer}</p></div>
          </div>
        ))}
      </div>
    </div>
  );
  return (
    <section aria-label="Certifications" className="relative z-10 flex flex-col gap-3 overflow-hidden bg-background py-16">
      <MonoLabel index="07" className="mb-4 px-5 sm:px-8 md:px-10">Certifications</MonoLabel>
      {row(certifications.slice(0, 3))}
      {row(certifications.slice(3), true)}
    </section>
  );
}

export function Journey() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [lit, setLit] = useState(0);
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  scrollYProgress.on("change", (v) => { const n = Math.round(v * (journey.length - 1)); setLit((p) => (p === n ? p : n)); });
  return (
    <section ref={ref} aria-label="Engineering journey" className="relative z-10 h-[220vh] bg-bg2">
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-12 overflow-hidden px-5 sm:px-8 md:px-10">
        <div><MonoLabel index="08">Engineering journey</MonoLabel><h2 className="hero-heading section-heading mt-3">From ECE to real-world systems</h2></div>
        <div className="relative">
          <div className="absolute left-0 right-0 top-[11px] hidden h-px bg-line-strong md:block"><motion.div style={{ width }} className="h-full bg-signal" /></div>
          <ol className="grid grid-cols-3 gap-y-8 md:grid-cols-9 md:gap-2">
            {journey.map((j, i) => (
              <li key={j} className="relative flex flex-col items-start gap-3 md:items-center md:text-center">
                <span className={cn("relative z-10 size-6 rounded-full border-2 transition-all duration-500", i <= lit ? "border-signal bg-signal glow-dot" : "border-line-strong bg-bg2", i === journey.length - 1 && i <= lit && "ring-8 ring-signal/20")} />
                <span className={cn("font-mono text-[0.68rem] uppercase tracking-wider transition-colors", i <= lit ? "text-foreground" : "text-muted-foreground")}>{j}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function Resume() {
  return (
    <section id="resume" className="relative z-10 bg-background px-5 py-20 sm:px-8 md:px-10">
      <FadeIn className="glass mx-auto flex max-w-5xl flex-col items-center gap-8 rounded-[40px] p-6 md:flex-row md:p-10">
        <a href={resume.url} target="_blank" rel="noreferrer" className="relative block aspect-[1/1.3] w-40 shrink-0 overflow-hidden rounded-2xl border border-line-strong bg-lab p-4">
          {Array.from({ length: 12 }).map((_, i) => <div key={i} className="mb-2 h-1.5 rounded bg-lab-ink/15" style={{ width: `${40 + ((i * 37) % 60)}%` }} />)}
          <span className="absolute bottom-3 left-3 font-mono text-[0.6rem] uppercase tracking-widest text-lab-ink">PDF // 1 page</span>
        </a>
        <div className="flex-1 text-center md:text-left">
          <MonoLabel index="09">Resume</MonoLabel>
          <h2 className="mt-2 font-display text-3xl font-bold uppercase md:text-5xl">The full spec sheet</h2>
          <p className="mt-3 text-muted-foreground">Embedded firmware, sensor-driven fault detection, wireless systems and computer vision on hardware.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3 md:justify-start">
            <PrimaryButton href={resume.url}>Download PDF</PrimaryButton>
            <GhostButton href={profile.linkedin} external>View on LinkedIn</GhostButton>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}

export function Contact() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") || "").trim(), email = String(f.get("email") || "").trim(), msg = String(f.get("message") || "").trim();
    if (!name || !/^\S+@\S+\.\S+$/.test(email) || msg.length < 5) { setErr("Please fill in your name, a valid email and a message."); setState("error"); return; }
    setState("sending");
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(`Portfolio message from ${name}`)}&body=${encodeURIComponent(`${msg}\n\n— ${name} (${email})`)}`;
    setTimeout(() => setState("done"), 600);
  };
  const rows = [
    { Icon: Mail, label: profile.email, href: `mailto:${profile.email}` },
    { Icon: Linkedin, label: profile.linkedinLabel, href: profile.linkedin },
    { Icon: Github, label: profile.githubLabel, href: profile.github },
  ];
  return (
    <section id="contact" className="relative z-10 overflow-hidden rounded-t-[40px] bg-bg2 px-5 pb-10 pt-20 sm:rounded-t-[50px] sm:px-8 md:rounded-t-[60px] md:px-10 md:pt-28">
      <div aria-hidden className="absolute left-1/2 top-24 size-[520px] -translate-x-1/2">
        {[0, 1, 2].map((i) => <div key={i} className="animate-rf absolute inset-0 rounded-full border border-rf/30" style={{ animationDelay: `${i * 1.3}s` }} />)}
      </div>
      <div className="relative mx-auto max-w-7xl">
        <FadeIn><h2 className="hero-heading max-w-5xl font-display font-bold uppercase leading-[0.95] tracking-tight" style={{ fontSize: "clamp(2.4rem,7vw,104px)" }}>Let's build something that works in the real world.</h2></FadeIn>
        <div className="mt-14 grid gap-12 lg:grid-cols-2">
          <div className="flex flex-col">
            {rows.map(({ Icon, label, href }) => (
              <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="group flex items-center gap-4 border-t border-line py-6 last:border-b">
                <span className="flex size-12 items-center justify-center rounded-full border border-line-strong transition-colors group-hover:border-signal group-hover:text-signal"><Icon className="size-5" /></span>
                <span className="break-all font-display text-lg transition-colors group-hover:text-signal md:text-2xl">{label}</span>
              </a>
            ))}
          </div>
          <form onSubmit={submit} noValidate className="glass flex flex-col gap-4 rounded-[32px] p-6 md:p-8">
            {[["name", "Name", "text"], ["email", "Email", "email"]].map(([n, l, t]) => (
              <label key={n} className="flex flex-col gap-2"><span className="mono-label">{l}</span>
                <input name={n} type={t} maxLength={120} required className="min-h-12 rounded-2xl border border-line-strong bg-background/60 px-4 text-foreground outline-none transition-colors focus:border-signal" />
              </label>
            ))}
            <label className="flex flex-col gap-2"><span className="mono-label">Message</span>
              <textarea name="message" rows={5} maxLength={2000} required className="rounded-2xl border border-line-strong bg-background/60 p-4 text-foreground outline-none transition-colors focus:border-signal" />
            </label>
            {state === "error" && <p role="alert" className="text-sm text-warn">{err}</p>}
            {state === "done" && <p role="status" className="font-mono text-sm text-signal">Signal received. Your email app should open to send it.</p>}
            <PrimaryButton type="submit" disabled={state === "sending"} className="mt-2 self-start">{state === "sending" ? "Transmitting…" : "Send Message"}</PrimaryButton>
          </form>
        </div>
        <footer className="mt-20 flex flex-col items-center justify-between gap-6 border-t border-line pt-8 md:flex-row">
          <p className="mono-label">© 2026 K. Prajith Raj</p>
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Sense <span className="text-signal">→</span> Process <span className="text-signal">→</span> Communicate <span className="text-signal">→</span> Act</p>
          <a href="#top" aria-label="Back to top" className="flex size-11 items-center justify-center rounded-full border border-line-strong transition-colors hover:border-signal hover:text-signal"><ArrowUp className="size-5" /></a>
        </footer>
      </div>
    </section>
  );
}
