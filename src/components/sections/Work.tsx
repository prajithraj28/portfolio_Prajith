import { motion, useScroll, useTransform, AnimatePresence, type MotionValue } from "framer-motion";
import { X, Image as ImageIcon, ZoomIn, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type WheelEvent as ReactWheelEvent } from "react";
import { ChipTag, CountUp, FadeIn, FlowDiagram, GhostButton, MonoLabel, PrimaryButton, Tilt } from "@/components/ui/kit";
import { ProjectScene } from "@/components/scenes";
import { projects, experience } from "@/data/portfolio";

const FINDING_DEVICE_IMAGE = "/Findingdevice.png";
const FINDING_DEVICE_THUMBNAILS = [{ label: "Front", src: FINDING_DEVICE_IMAGE }];
const FINDING_DEVICE_COMPONENTS = [
  { key: "enclosure", name: "ENCLOSURE", description: "Compact enclosure designed for wearable / portable integration and protection.", specs: ["Low-profile enclosure", "Durable body", "Compact form factor"] },
  { key: "pcb", name: "PCB", description: "Main electronics layout integrating sensing, processing and connectivity modules.", specs: ["Embedded controller", "Wireless circuitry", "Compact assembly"] },
  { key: "antenna", name: "ANTENNA", description: "Wireless communication path for remote tracking and telemetry exchange.", specs: ["Signal path", "Connectivity interface", "Compact RF design"] },
  { key: "battery", name: "BATTERY", description: "Power source for the portable tracking unit and embedded monitoring system.", specs: ["Portable power", "Energy storage", "Low-power design"] },
] as const;

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
              <div className="h-full w-full overflow-hidden rounded-[32px] border border-line bg-background">
                {p.title === "Finding Device" ? (
                  <img src={FINDING_DEVICE_IMAGE} alt="Finding Device" className="h-full w-full object-contain p-2" />
                ) : (
                  <ProjectScene scene={p.key} />
                )}
              </div>
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

function FindingDeviceDetail({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k); document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", k); document.body.style.overflow = ""; };
  }, [onClose]);

  const [activeComponent, setActiveComponent] = useState<(typeof FINDING_DEVICE_COMPONENTS)[number]["key"]>("enclosure");
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [rotation, setRotation] = useState(0);
  const dragRef = useRef<{ startX: number; startY: number; dragType: "pan" | "rotate" } | null>(null);

  const selectedComponent = FINDING_DEVICE_COMPONENTS.find((component) => component.key === activeComponent) ?? FINDING_DEVICE_COMPONENTS[0];
  const flow = ["OBJECT", "FINDING DEVICE", "PROCESSING", "WIRELESS CONNECTION", "USER INTERFACE", "FIND"];

  useEffect(() => {
    setZoom(1); setOffset({ x: 0, y: 0 });
  }, [selectedComponent.key]);

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    setZoom((current) => Math.min(2.6, Math.max(1, Number((current + (event.deltaY < 0 ? 0.12 : -0.12)).toFixed(2)))));
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    dragRef.current = { startX: event.clientX, startY: event.clientY, dragType: "rotate" };
    setDragging(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!dragRef.current) return;
    const dx = event.clientX - dragRef.current.startX;
    const dy = event.clientY - dragRef.current.startY;

    if (Math.abs(dx) > Math.abs(dy)) {
      setRotation((current) => current + dx * 0.35);
    } else if (zoom > 1) {
      setOffset((prev) => ({ x: prev.x + dx * 0.8, y: prev.y + dy * 0.8 }));
    }

    dragRef.current.startX = event.clientX;
    dragRef.current.startY = event.clientY;
  };

  const handlePointerUp = () => {
    dragRef.current = null;
    setDragging(false);
  };

  const resetView = () => {
    setZoom(1);
    setOffset({ x: 0, y: 0 });
    setRotation(0);
  };

  return (
    <motion.div className="fixed inset-0 z-[80] overflow-y-auto bg-background/85 p-3 backdrop-blur-md sm:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div role="dialog" aria-modal aria-label="Finding Device project detail" onClick={(e) => e.stopPropagation()} className="relative mx-auto max-w-6xl rounded-[40px] border border-line-strong bg-bg2 p-4 sm:p-8 md:p-10">
        <button onClick={onClose} aria-label="Close" className="absolute right-5 top-5 flex size-11 items-center justify-center rounded-full border border-line bg-panel/80"><X className="size-5" /></button>

        <header className="mb-8">
          <p className="mono-label text-[0.7rem] uppercase tracking-[0.35em] text-signal">// 05 — flagship product</p>
          <h3 className="mt-4 font-display text-[clamp(3rem,7vw,8rem)] font-bold uppercase leading-[0.9] tracking-[-0.06em] text-foreground">FINDING DEVICE</h3>
          <div className="mt-3 flex flex-wrap gap-2 text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground">
            <span className="rounded-full border border-line px-2 py-1">3D VIEW</span>
            <span className="rounded-full border border-line px-2 py-1">ROTATE 360°</span>
            <span className="rounded-full border border-line px-2 py-1">ZOOM</span>
            <span className="rounded-full border border-line px-2 py-1">EXPLORE</span>
          </div>
        </header>

        <div className="grid gap-7 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <div className="rounded-[30px] border border-line-strong bg-[#060d15] p-3 shadow-[inset_0_0_0_1px_rgba(148,163,184,0.08)] sm:p-5">
            <div className="relative overflow-hidden rounded-[28px] border border-line bg-background/30 px-4 py-6">
              <div className="tech-grid absolute inset-0 opacity-80" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.12),transparent_38%)]" />
              <div className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/60" />
              <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full border border-line/30" />

              <div className="relative mx-auto max-w-[760px]">
                <div onWheel={handleWheel} onPointerDown={handlePointerDown} onPointerMove={handlePointerMove} onPointerUp={handlePointerUp} onPointerLeave={handlePointerUp} className="relative flex h-[430px] cursor-grab touch-pan-y items-center justify-center overflow-hidden rounded-[24px] active:cursor-grabbing">
                  <img
                    src={FINDING_DEVICE_IMAGE}
                    alt="Finding Device product"
                    className="pointer-events-none max-h-full max-w-full select-none object-contain transition-transform duration-150 ease-out"
                    style={{
                      transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                      filter: "drop-shadow(0 30px 28px rgba(16, 185, 129, 0.12))",
                    }}
                  />
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 text-[0.62rem] uppercase tracking-[0.32em] text-muted-foreground">
                  <span>Drag to rotate 360°</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={resetView} className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/50 px-2.5 py-1.5 text-[0.58rem] uppercase tracking-[0.24em] text-foreground">
                      <RotateCcw className="size-3" /> Reset view
                    </button>
                    <div className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/50 px-2.5 py-1.5 text-[0.58rem] uppercase tracking-[0.24em] text-foreground">
                      <ZoomIn className="size-3" /> {zoom.toFixed(2)}x
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {FINDING_DEVICE_THUMBNAILS.map((thumb, index) => (
                <button key={thumb.label} type="button" className={`flex items-center justify-center rounded-full border px-3 py-1.5 font-mono text-[0.56rem] uppercase tracking-[0.18em] ${index === 0 ? "border-signal bg-signal/8 text-signal" : "border-line bg-panel/70 text-muted-foreground"}`}>
                  {thumb.label}
                </button>
              ))}
            </div>
          </div>

          <aside className="rounded-[30px] border border-line-strong bg-background/50 p-4 sm:p-5">
            <p className="mono-label text-[0.68rem] uppercase tracking-[0.28em] text-signal">Product Details</p>
            <h4 className="mt-4 font-display text-3xl font-bold uppercase tracking-[-0.06em] text-foreground">Finding Device</h4>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">A compact IoT-based tracking device designed for real-time location monitoring and connected asset tracking.</p>

            <div className="mt-6 space-y-5">
              <div>
                <p className="mono-label text-[0.62rem] uppercase tracking-[0.24em] text-muted-foreground">Application</p>
                <div className="mt-2 flex flex-wrap gap-2 text-[0.7rem] uppercase tracking-[0.12em] text-foreground">
                  <span className="rounded-full border border-line px-2.5 py-1.5">Asset Tracking</span>
                  <span className="rounded-full border border-line px-2.5 py-1.5">Vehicle Tracking</span>
                  <span className="rounded-full border border-line px-2.5 py-1.5">IoT Monitoring</span>
                </div>
              </div>

              <div>
                <p className="mono-label text-[0.62rem] uppercase tracking-[0.24em] text-muted-foreground">Technology</p>
                <div className="mt-2 flex flex-wrap gap-2 text-[0.7rem] uppercase tracking-[0.12em] text-foreground">
                  <span className="rounded-full border border-line px-2.5 py-1.5">ESP32</span>
                  <span className="rounded-full border border-line px-2.5 py-1.5">GPS</span>
                  <span className="rounded-full border border-line px-2.5 py-1.5">Cellular</span>
                  <span className="rounded-full border border-line px-2.5 py-1.5">IoT</span>
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border border-line-strong bg-panel/40 p-3">
              <p className="mono-label text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground">Components</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {FINDING_DEVICE_COMPONENTS.map((component) => (
                  <button
                    key={component.key}
                    type="button"
                    onClick={() => setActiveComponent(component.key)}
                    className={`rounded-full border px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] transition-colors ${activeComponent === component.key ? "border-signal bg-signal/10 text-signal" : "border-line bg-background/60 text-foreground"}`}
                  >
                    {component.name}
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-[18px] border border-line bg-background/60 p-3">
                <p className="mono-label text-[0.58rem] uppercase tracking-[0.24em] text-signal">{selectedComponent.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground">{selectedComponent.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedComponent.specs.map((spec) => (
                    <span key={spec} className="rounded-full border border-line px-2 py-1 text-[0.56rem] uppercase tracking-[0.12em] text-muted-foreground">{spec}</span>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-10">
          <div className="grid gap-4 md:grid-cols-5">
            {[["Problem", "Finding Device helps users locate misplaced everyday items using connected monitoring and smart tracking."], ["Approach", "Compact hardware, embedded processing and wireless connectivity combine into a practical, low-friction user experience."], ["Hardware", "The product is designed as a small, portable unit for real-world tracking, with embedded electronics and power integration."], ["Firmware", "The system processes local sensing and communication tasks to support reliable status updates and tracking."], ["Result", "The concept turns a familiar problem into a connected engineering product with a premium hardware showcase." ]].map(([label, value], index) => (
              <div key={label} className="rounded-[18px] border border-line-strong bg-panel/50 p-4">
                <p className="mono-label text-[0.58rem] uppercase tracking-[0.22em] text-signal">0{index + 1}</p>
                <p className="mt-3 font-medium uppercase text-foreground">{label}</p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value}</p>
              </div>
            ))}
          </div>
        </section>
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
      <FadeIn className="mb-10 text-center"><h2 className="hero-heading section-heading mt-3">Projects</h2></FadeIn>
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

  type TimelineNode = {
    company: string;
    role: string;
    dates: string;
    chips: string[];
    bullets: string[];
    location?: string;
    department?: string;
    edu?: boolean;
  };

  const nodes: TimelineNode[] = [
    ...experience.map((e) => ({ ...e, edu: false })),
    { company: "St. Joseph's Institute of Technology, Chennai", role: "B.E. Electronics & Communication Engineering", dates: "2023 – 2027", chips: ["CGPA 7.9 / 10"], bullets: [], edu: true },
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

                  <h3 className="mt-3 font-display text-2xl font-bold leading-tight md:text-[2rem]">{n.role}</h3>

                  {!n.edu && (
                    <>
                      <p className="mt-2 text-lg font-medium text-foreground/90">{n.company}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {n.location}
                        {n.department ? <> · {n.department}</> : null}
                      </p>
                    </>
                  )}

                  {n.edu && <p className="mono-label mt-2 normal-case">{n.company}</p>}

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
