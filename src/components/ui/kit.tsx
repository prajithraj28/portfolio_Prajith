import { motion, useScroll, useTransform, useReducedMotion, useInView, type MotionValue } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from "react";
import { cn } from "@/lib/utils";

const EASE = [0.25, 0.1, 0.25, 1] as const;

export function FadeIn({
  children, delay = 0, duration = 0.7, x = 0, y = 30, className, style,
}: { children: ReactNode; delay?: number; duration?: number; x?: number; y?: number; className?: string; style?: CSSProperties }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={style as any}
      initial={reduce ? { opacity: 0 } : { opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ delay, duration, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

export function Magnet({ children, padding = 150, strength = 3, className }: { children: ReactNode; padding?: number; strength?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0, active: false });
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    const onMove = (e: MouseEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      if (Math.abs(dx) < r.width / 2 + padding && Math.abs(dy) < r.height / 2 + padding) {
        setPos({ x: dx / strength, y: dy / strength, active: true });
      } else setPos((p) => (p.active ? { x: 0, y: 0, active: false } : p));
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [padding, strength]);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: pos.active ? "transform 0.3s ease-out" : "transform 0.6s ease-in-out",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}

function Char({ c, i, total, progress }: { c: string; i: number; total: number; progress: MotionValue<number> }) {
  const start = i / total;
  const opacity = useTransform(progress, [start, Math.min(1, start + 1 / total * 8)], [0.2, 1]);
  return (
    <span className="relative">
      <span className="invisible">{c}</span>
      <motion.span className="absolute left-0 top-0" style={{ opacity }}>{c}</motion.span>
    </span>
  );
}

export function AnimatedText({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.2"] });
  const words = text.split(" ");
  let idx = 0;
  return (
    <p ref={ref} className={className}>
      {words.map((w, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {[...w].map((c) => { const i = idx++; return <Char key={i} c={c} i={i} total={text.length} progress={scrollYProgress} />; })}
          {wi < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </p>
  );
}

const sizes = { md: "px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base", sm: "px-5 py-2.5 text-xs" };

export function PrimaryButton({ children, href, size = "md", className, type, onClick, disabled, target, rel, download }: { children: ReactNode; href?: string; size?: "md" | "sm"; className?: string; type?: "submit" | "button"; onClick?: () => void; disabled?: boolean; target?: string; rel?: string; download?: boolean | string }) {
  const cls = cn("btn-primary group inline-flex min-h-11 items-center justify-center gap-2 rounded-full font-medium uppercase tracking-widest transition-shadow duration-300 disabled:opacity-60", sizes[size], className);
  const inner = <>{children}<ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" /></>;
  return href ? <a href={href} className={cls} target={target} rel={rel} download={download}>{inner}</a> : <button type={type ?? "button"} onClick={onClick} disabled={disabled} className={cls}>{inner}</button>;
}

export function GhostButton({ children, href, size = "md", className, download, onClick, external, target, rel }: { children: ReactNode; href?: string; size?: "md" | "sm"; className?: string; download?: boolean | string; onClick?: () => void; external?: boolean; target?: string; rel?: string }) {
  const cls = cn("inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-line-strong font-medium uppercase tracking-widest text-foreground transition-colors duration-200 hover:border-signal hover:bg-foreground/5", sizes[size], className);
  return href ? <a href={href} className={cls} download={download} target={target ?? (external ? "_blank" : undefined)} rel={rel ?? (external ? "noreferrer" : undefined)}>{children}</a> : <button type="button" onClick={onClick} className={cls}>{children}</button>;
}

export function ChipTag({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn("inline-flex items-center rounded-full border border-line px-3 py-1 font-mono text-xs text-muted-foreground", className)}>{children}</span>;
}

export function MonoLabel({ index, children, className }: { index?: string; children: ReactNode; className?: string }) {
  return <p className={cn("mono-label", className)}>{index && <span className="text-signal">// {index} </span>}{children}</p>;
}

/** Horizontal (desktop) / vertical (mobile) node chain with travelling packets. */
export function FlowDiagram({ nodes, className }: { nodes: string[]; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <div ref={ref} className={cn("flex flex-col gap-0 md:flex-row md:items-center", className)}>
      {nodes.map((n, i) => (
        <div key={n + i} className="flex flex-col items-start md:flex-1 md:flex-row md:items-center">
          <motion.div
            initial={{ opacity: 0.25 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: i * 0.25, duration: 0.4 }}
            className="flex items-center gap-2 rounded-full border border-line-strong bg-panel/60 px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-wider text-foreground"
          >
            <motion.span
              className="size-1.5 rounded-full bg-muted-foreground"
              animate={inView ? { backgroundColor: "var(--signal)" } : {}}
              transition={{ delay: i * 0.25 }}
            />
            {n}
          </motion.div>
          {i < nodes.length - 1 && (
            <div className="relative ml-4 h-6 w-px bg-line-strong md:ml-0 md:h-px md:w-auto md:min-w-6 md:flex-1">
              {inView && (
                <span
                  className="glow-dot absolute left-[-2.5px] top-0 size-1.5 rounded-full bg-signal md:left-0 md:top-[-2.5px]"
                  style={{ animation: `flow-packet-${i % 2} 2.4s ${i * 0.3}s linear infinite` }}
                />
              )}
            </div>
          )}
        </div>
      ))}
      <style>{`
        @keyframes flow-packet-0 { from { left: 0; top: -2.5px; opacity: 0 } 15% { opacity: 1 } to { left: 100%; top: -2.5px; opacity: 0 } }
        @keyframes flow-packet-1 { from { left: 0; top: -2.5px; opacity: 0 } 15% { opacity: 1 } to { left: 100%; top: -2.5px; opacity: 0 } }
        @media (max-width: 767px) {
          @keyframes flow-packet-0 { from { top: 0; left: -2.5px; opacity: 0 } 15% { opacity: 1 } to { top: 100%; left: -2.5px; opacity: 0 } }
          @keyframes flow-packet-1 { from { top: 0; left: -2.5px; opacity: 0 } 15% { opacity: 1 } to { top: 100%; left: -2.5px; opacity: 0 } }
        }
      `}</style>
    </div>
  );
}

/** Cursor tilt container (max 8deg). */
export function Tilt({ children, className, max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState({ x: 0, y: 0 });
  return (
    <div style={{ perspective: 1200 }} className={className}>
      <div
        ref={ref}
        onMouseMove={(e) => {
          const r = ref.current!.getBoundingClientRect();
          setT({ x: ((e.clientY - r.top) / r.height - 0.5) * -2 * max, y: ((e.clientX - r.left) / r.width - 0.5) * 2 * max });
        }}
        onMouseLeave={() => setT({ x: 0, y: 0 })}
        style={{ transform: `rotateX(${t.x}deg) rotateY(${t.y}deg)`, transition: "transform 0.4s ease-out", transformStyle: "preserve-3d" }}
        className="h-full w-full"
      >
        {children}
      </div>
    </div>
  );
}

export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const m = value.match(/^([^\d]*)(\d+(?:\.\d+)?)(.*)$/);
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView || !m) return;
    const target = parseFloat(m[2] ?? "0");
    let raf = 0; const t0 = performance.now();
    const step = (t: number) => { const p = Math.min(1, (t - t0) / 1100); setN(target * (1 - Math.pow(1 - p, 3))); if (p < 1) raf = requestAnimationFrame(step); };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [inView]); // eslint-disable-line react-hooks/exhaustive-deps
  if (!m) return <span ref={ref}>{value}</span>;
  const dec = (m[2] ?? "").includes(".") ? 1 : 0;
  return <span ref={ref}>{m[1]}{inView ? n.toFixed(dec) : "0"}{m[3]}</span>;
}
