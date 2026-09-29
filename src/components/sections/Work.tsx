import { motion, useScroll, useTransform, AnimatePresence, type MotionValue } from "framer-motion";
import { X, Image as ImageIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ChipTag, CountUp, FadeIn, FlowDiagram, GhostButton, MonoLabel, Tilt } from "@/components/ui/kit";
import { ProjectScene } from "@/components/scenes";
import { projects, experience } from "@/data/portfolio";

type P = (typeof projects)[number];

function PhotoSlot({ label, className }: { label: string; className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-2 rounded-[32px] border border-dashed border-line-strong bg-panel/40 text-muted-foreground sm:rounded-[40px] ${className ?? ""}`}>
      <ImageIcon className="size-4" /><span className="font-mono text-[0.65rem] uppercase tracking-widest">{label}</span>
    </div>
  );
}

function Card({ p, i, total, progress, onOpen }: { p: P; i: number; total: number; progress: MotionValue<number>; onOpen: () => void }) {
  const target = 1 - (total - 1 - i) * 0.03;
  const scale = useTransform(progress, [i / total, 1], [1, target]);
  return (
    <div className="sticky top-24 flex h-[90vh] items-start md:top-32">
      <motion.article
        layoutId={`card-${p.key}`}
        style={{ scale, top: i * 28 }}
        className="relative w-full origin-top rounded-[40px] border-2 border-line-strong bg-bg2 p-4 sm:rounded-[50px] sm:p-6 md:rounded-[60px] md:p-8"
      >
        <div className="flex flex-wrap items-start gap-4 md:flex-nowrap md:items-center md:gap-8">
          <span className="font-display font-bold leading-none text-foreground" style={{ fontSize: "clamp(3rem,8vw,110px)" }}>{String(i + 1).padStart(2, "0")}</span>
          <div className="min-w-0 flex-1">
            <p className="mono-label">{p.category}</p>
            <h3 className="mt-1 font-display text-xl font-medium uppercase leading-tight md:text-3xl">{p.title}</h3>
          </div>
          <GhostButton size="sm" onClick={onOpen}>View Case Study</GhostButton>
        </div>
        <div className="mt-5 grid gap-4 md:mt-6 md:grid-cols-[55%_1fr] md:gap-6">
          <button onClick={onOpen} aria-label={`Open ${p.title} case study`} className="text-left">
            <Tilt className="aspect-[16/10] w-full">
              <div className="h-full w-full overflow-hidden rounded-[32px] border border-line bg-background"><ProjectScene scene={p.key} /></div>
            </Tilt>
          </button>
          <div className="hidden grid-cols-[40%_1fr] gap-3 md:grid">
            <div className="flex flex-col gap-3">
              <PhotoSlot label={`p${i + 1}-a`} className="h-[clamp(110px,11vw,170px)]" />
              <PhotoSlot label={`p${i + 1}-b`} className="flex-1" />
            </div>
            <PhotoSlot label={`p${i + 1}-c`} />
          </div>
        </div>
        <FlowDiagram nodes={p.flow} className="mt-5 hidden md:flex" />
        <div className="mt-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-wrap gap-2">{p.tags.map((t) => <ChipTag key={t}>{t}</ChipTag>)}</div>
          <div className="flex gap-6">
            {p.metrics.map((m) => (
              <div key={m.label}><p className="font-display text-2xl font-bold text-signal md:text-3xl"><CountUp value={m.value} /></p><p className="mono-label !text-[0.6rem]">{m.label}</p></div>
            ))}
          </div>
        </div>
      </motion.article>
    </div>
  );
}

function CaseModal({ p, onClose }: { p: P; onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k); document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [onClose]);
  const steps = [["Problem", p.problem], ["Approach", p.approach], ["Hardware", p.hardware], ["Firmware", p.firmware], ["Result", p.result]];
  return (
    <motion.div className="fixed inset-0 z-[80] overflow-y-auto bg-background/80 p-3 backdrop-blur-md sm:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div layoutId={`card-${p.key}`} role="dialog" aria-modal aria-label={p.title} onClick={(e) => e.stopPropagation()} className="relative mx-auto max-w-5xl rounded-[40px] border-2 border-line-strong bg-bg2 p-5 sm:p-10">
        <button onClick={onClose} aria-label="Close" className="absolute right-5 top-5 flex size-11 items-center justify-center rounded-full border border-line"><X className="size-5" /></button>
        <p className="mono-label">{p.category}</p>
        <h3 className="mt-2 pr-12 font-display text-2xl font-bold uppercase md:text-4xl">{p.title}</h3>
        <div className="mt-6 aspect-[16/10] overflow-hidden rounded-[32px] border border-line bg-background"><ProjectScene scene={p.key} /></div>
        <div className="mt-8 grid gap-6 md:grid-cols-5">
          {steps.map(([k, v], i) => (
            <div key={k} className="border-t border-signal/40 pt-3"><p className="mono-label"><span className="text-signal">0{i + 1}</span> {k}</p><p className="mt-2 text-sm leading-relaxed text-foreground">{v}</p></div>
          ))}
        </div>
        <ul className="mt-8 space-y-2 text-sm text-muted-foreground">{p.facts.map((f) => <li key={f} className="flex gap-2"><span className="mt-2 size-1 shrink-0 rounded-full bg-signal" />{f}</li>)}</ul>
        <div className="mt-8 grid grid-cols-3 gap-3">{["a", "b", "c"].map((s) => <PhotoSlot key={s} label={`photo ${s}`} className="aspect-square" />)}</div>
      </motion.div>
    </motion.div>
  );
}

export function Projects() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [open, setOpen] = useState<P | null>(null);
  return (
    <section id="work" className="relative z-10 -mt-10 rounded-t-[40px] bg-background px-4 pb-20 pt-20 sm:-mt-12 sm:rounded-t-[50px] sm:px-8 md:-mt-14 md:rounded-t-[60px] md:px-10 md:pt-28">
      <FadeIn className="mb-10 text-center"><MonoLabel index="03">Selected hardware work</MonoLabel><h2 className="hero-heading section-heading mt-3">Projects</h2></FadeIn>
      <div ref={ref} className="mx-auto max-w-7xl">
        {projects.map((p, i) => <Card key={p.key} p={p} i={i} total={projects.length} progress={scrollYProgress} onOpen={() => setOpen(p)} />)}
      </div>
      <AnimatePresence>{open && <CaseModal p={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
}

export function Experience() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "end 0.5"] });
  const nodes = [
    ...experience.map((e) => ({ ...e, edu: false })),
    { company: "St. Joseph's Institute of Technology, Chennai", role: "B.E. Electronics & Communication Engineering", dates: "2023 – 2027", chips: ["CGPA 7.8 / 10"], bullets: [], edu: true },
  ];
  return (
    <section id="experience" className="relative z-10 bg-background px-5 py-20 sm:px-8 md:px-10 md:py-32">
      <FadeIn className="mb-16 text-center"><MonoLabel index="04">Engineering timeline</MonoLabel><h2 className="hero-heading section-heading mt-3">Experience</h2></FadeIn>
      <div ref={ref} className="relative mx-auto max-w-5xl">
        <div className="absolute bottom-0 left-4 top-0 w-px bg-line-strong md:left-1/2">
          <motion.div style={{ scaleY: scrollYProgress }} className="h-full w-full origin-top bg-signal" />
        </div>
        <div className="flex flex-col gap-12">
          {nodes.map((n, i) => (
            <div key={n.company} className={`relative pl-12 md:w-1/2 md:pl-0 ${i % 2 ? "md:ml-auto md:pl-12" : "md:pr-12"}`}>
              <span className={`glow-dot absolute left-[11px] top-6 size-3 rounded-full bg-signal ${i % 2 ? "md:-left-1.5" : "md:left-auto md:-right-1.5"}`} />
              <FadeIn x={i % 2 ? 40 : -40} y={0}>
                <div className={`glass rounded-[28px] p-6 md:p-8 ${n.edu ? "opacity-90" : ""}`}>
                  <p className="font-mono text-xs uppercase tracking-widest text-signal">{n.dates}</p>
                  <h3 className="mt-2 font-display text-xl font-bold md:text-2xl">{n.role}</h3>
                  <p className="mono-label mt-1 normal-case">{n.company}</p>
                  {n.bullets.length > 0 && <ul className="mt-4 space-y-2 text-sm leading-relaxed text-muted-foreground">{n.bullets.map((b) => <li key={b} className="flex gap-2"><span className="mt-2 size-1 shrink-0 rounded-full bg-signal" />{b}</li>)}</ul>}
                  <div className="mt-4 flex flex-wrap gap-2">{n.chips.map((c) => <ChipTag key={c}>{c}</ChipTag>)}</div>
                </div>
              </FadeIn>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
