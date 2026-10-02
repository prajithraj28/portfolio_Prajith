import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from "framer-motion";
import { Mail, Linkedin, Github, ArrowUp, X, Image as ImageIcon, Trophy, Medal, Award, ScrollText } from "lucide-react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import * as THREE from "three";
import { FadeIn, GhostButton, MonoLabel, PrimaryButton, Tilt, ChipTag } from "@/components/ui/kit";
import { achievements, certifications, journey, profile } from "@/data/portfolio";
import resume from "@/assets/KPrajith_resume.pdf.asset.json";
import { cn } from "@/lib/utils";

const icons = { trophy: Trophy, medal: Medal, badge: Award, plaque: ScrollText };
const findingDeviceImage = "/Findingdevice.png";
const componentNamesByKey: Record<string, readonly string[]> = {
  pcb: ["PCB", "Microcontroller", "GPS_Module", "GSM_Module"],
  camera: ["Camera_Housing", "Camera_Lens"],
  antenna: ["Antenna"],
  battery: ["Battery"],
  enclosure: ["Enclosure_Lid", "Enclosure_Base", "Status_LED"],
} as const;
const productComponents = [
  { key: "pcb", name: "PCB", description: "Main electronics layout integrating sensing, processing and connectivity modules.", specs: ["Embedded controller", "Wireless circuitry", "Compact assembly"] },
  { key: "camera", name: "CAMERA", description: "Camera module housed in the device enclosure for image capture.", specs: ["Camera housing", "Optical lens", "Embedded vision"] },
  { key: "antenna", name: "ANTENNA", description: "Wireless communication path for remote tracking and telemetry exchange.", specs: ["Signal path", "Connectivity interface", "Compact RF design"] },
  { key: "battery", name: "BATTERY", description: "Power source for the portable tracking unit and embedded monitoring system.", specs: ["Portable power", "Energy storage", "Low-power design"] },
  { key: "enclosure", name: "ENCLOSURE", description: "Compact enclosure designed for wearable / portable integration and protection.", specs: ["Low-profile enclosure", "Durable body", "Compact form factor"] },
] as const;

function FindingDeviceStage({ exploded, activeComponent }: { exploded: boolean; activeComponent: string }) {
  const { scene } = useGLTF("/models/Finding_Device_3D_Concept.glb");
  const model = useMemo(() => scene.clone(true), [scene]);
  const offsetMapRef = useRef<Record<string, [number, number, number]>>({});
  const basePositionsRef = useRef<Map<string, THREE.Vector3>>(new Map());

  useEffect(() => {
    let cancelled = false;

    fetch("/models/explode_offsets.json")
      .then((response) => response.json())
      .then((offsets) => {
        if (!cancelled) offsetMapRef.current = offsets as Record<string, [number, number, number]>;
      })
      .catch((error) => console.error("Failed to load explode offsets", error));

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    basePositionsRef.current.clear();
    model.traverse((child) => {
      if (child.name) {
        basePositionsRef.current.set(child.name, child.position.clone());
      }
    });
  }, [model]);

  useFrame(() => {
    const selectedNames = componentNamesByKey[activeComponent as keyof typeof componentNamesByKey] ?? [];

    model.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      const base = basePositionsRef.current.get(child.name);
      if (!base) return;

      const offset = offsetMapRef.current[child.name] ?? [0, 0, 0];
      const target = exploded ? base.clone().add(new THREE.Vector3(...offset)) : base.clone();
      child.position.lerp(target, 0.09);

      const materialCandidates = Array.isArray(child.material) ? child.material : [child.material];

      materialCandidates.forEach((material) => {
        if (!material || !("emissive" in material)) return;
        const isSelected = selectedNames.includes(child.name);
        material.emissive = new THREE.Color(isSelected ? "#5eead4" : "#000000");
        material.emissiveIntensity = isSelected ? 0.9 : 0;
      });
    });
  });

  return <primitive object={model} scale={1.4} position={[0, -1.2, 0]} />;
}

function ProductViewer({ onClose }: { onClose: () => void }) {
  const [activeComponent, setActiveComponent] = useState<(typeof productComponents)[number]["key"]>("pcb");
  const [exploded, setExploded] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey); document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);

  const selectedComponent = productComponents.find((component) => component.key === activeComponent) ?? productComponents[0];

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      return;
    }
    await document.exitFullscreen();
  };

  return (
    <motion.div className="fixed inset-0 z-[80] overflow-y-auto bg-background/85 p-3 backdrop-blur-md sm:p-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div role="dialog" aria-modal aria-label="Finding Device viewer" onClick={(e) => e.stopPropagation()} className="relative mx-auto max-w-6xl rounded-[40px] border border-line-strong bg-bg2 p-4 sm:p-8 md:p-10">
        <button onClick={onClose} aria-label="Close viewer" className="absolute right-5 top-5 flex size-11 items-center justify-center rounded-full border border-line bg-panel/80"><X className="size-5" /></button>

        <header className="mb-8">
          <p className="mono-label text-[0.7rem] uppercase tracking-[0.35em] text-signal">// 05 — flagship product</p>
          <h3 className="mt-4 font-display text-[clamp(2.8rem,6vw,7rem)] font-bold uppercase leading-[0.9] tracking-[-0.06em] text-foreground">FINDING DEVICE</h3>
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
                <div className="relative h-[430px] overflow-hidden rounded-[24px] border border-line bg-[#050d15]">
                  <Canvas camera={{ position: [0, 0.8, 10.5], fov: 35 }}>
                    <color attach="background" args={["#050d15"]} />
                    <ambientLight intensity={1.2} />
                    <directionalLight position={[6, 7, 6]} intensity={2.4} color="#d9f4ff" />
                    <spotLight position={[-6, 8, 8]} intensity={1.5} angle={0.35} penumbra={1} color="#7dd3fc" />
                    <FindingDeviceStage exploded={exploded} activeComponent={activeComponent} />
                    <OrbitControls enablePan enableZoom enableDamping autoRotate autoRotateSpeed={1.4} minDistance={4} maxDistance={12} target={[0, -0.5, 0]} />
                  </Canvas>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3 text-[0.62rem] uppercase tracking-[0.32em] text-muted-foreground">
                  <span>Drag to orbit / zoom</span>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setExploded((value) => !value)} className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/50 px-2.5 py-1.5 text-[0.58rem] uppercase tracking-[0.24em] text-foreground">
                      {exploded ? "Assembled" : "Exploded"}
                    </button>
                    <button type="button" onClick={toggleFullscreen} className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/50 px-2.5 py-1.5 text-[0.58rem] uppercase tracking-[0.24em] text-foreground">
                      Fullscreen
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {[{ label: "Front" }, { label: "Right" }, { label: "Back" }, { label: "Left" }].map((thumb, index) => (
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
                  <span className="rounded-full border border-line px-2.5 py-1.5">FLEET MANAGEMENT</span>
                  <span className="rounded-full border border-line px-2.5 py-1.5">IoT Monitoring</span>
                </div>
              </div>

              <div>
                <p className="mono-label text-[0.62rem] uppercase tracking-[0.24em] text-muted-foreground">Technology</p>
                <div className="mt-2 flex flex-wrap gap-2 text-[0.7rem] uppercase tracking-[0.12em] text-foreground">
                  {[
                    "MICROCONTROLLER",
                    "CAMERA",
                    "GPS",
                    "ML MODEL",
                    "Cellular",
                    "IoT",
                  ].map((tag) => (
                    <span key={tag} className="rounded-full border border-line px-2.5 py-1.5">{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 rounded-[24px] border border-line-strong bg-panel/40 p-3">
              <p className="mono-label text-[0.62rem] uppercase tracking-[0.28em] text-muted-foreground">Components</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {productComponents.map((component) => (
                  <button key={component.key} type="button" onClick={() => setActiveComponent(component.key)} className={`rounded-full border px-3 py-1.5 font-mono text-[0.6rem] uppercase tracking-[0.18em] transition-colors ${activeComponent === component.key ? "border-signal bg-signal/10 text-signal" : "border-line bg-background/60 text-foreground"}`}>
                    {component.name}
                  </button>
                ))}
              </div>

              <div className="mt-4 rounded-[18px] border border-line bg-background/60 p-3">
                <p className="mono-label text-[0.58rem] uppercase tracking-[0.24em] text-signal">{selectedComponent.name}</p>
                <p className="mt-2 text-sm leading-relaxed text-foreground">{selectedComponent.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedComponent.specs.map((spec) => <span key={spec} className="rounded-full border border-line px-2 py-1 text-[0.56rem] uppercase tracking-[0.12em] text-muted-foreground">{spec}</span>)}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function Product() {
  const [viewerOpen, setViewerOpen] = useState(false);

  return (
    <>
      <section id="product" className="relative z-10 bg-bg2 px-5 py-20 sm:px-8 md:px-10 md:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <FadeIn>
            <MonoLabel index="05">Flagship product</MonoLabel>
            <h2 className="hero-heading mt-3 font-display font-bold uppercase leading-none tracking-tight" style={{ fontSize: "clamp(2.2rem,6vw,84px)" }}>Finding Device</h2>
            <p className="mt-6 max-w-lg text-muted-foreground">A compact connected tracking device built for asset visibility, real-time monitoring and practical IoT deployment.</p>
            <div className="mt-6 flex flex-wrap gap-2">{["MICROCONTROLLER", "GPS", "CAMERA","Cellular", "IoT"].map((s) => <ChipTag key={s}>{s}</ChipTag>)}</div>
            <button type="button" onClick={() => setViewerOpen(true)} className="mt-8 inline-flex min-h-11 items-center justify-center gap-2 rounded-full border-2 border-line-strong px-8 py-3 font-medium uppercase tracking-widest text-foreground transition-colors duration-200 hover:border-signal hover:bg-foreground/5">Ask About It</button>
          </FadeIn>
          <FadeIn delay={0.2}>
            <button type="button" onClick={() => setViewerOpen(true)} className="block w-full text-left">
              <Tilt className="aspect-[4/3] w-full">
                <div className="relative h-full w-full overflow-hidden rounded-[32px] border border-line-strong bg-background">
                  <div className="tech-grid absolute inset-0" />
                  <img src={findingDeviceImage} alt="Finding Device product" className="absolute inset-0 h-full w-full object-contain p-3 sm:p-6" />
                </div>
              </Tilt>
            </button>
          </FadeIn>
        </div>
      </section>
      <AnimatePresence>{viewerOpen && <ProductViewer onClose={() => setViewerOpen(false)} />}</AnimatePresence>
    </>
  );
}

export function Achievements() {
  const [sel, setSel] = useState<number | null>(null);
  return (
    <section id="achievements" className="relative z-10 bg-background px-5 py-20 sm:px-8 md:px-10 md:py-32">
      <FadeIn className="mb-16 text-center"><MonoLabel index="07">Results</MonoLabel><h2 className="hero-heading section-heading mt-3">Achievements</h2></FadeIn>
      <div className="mx-auto max-w-6xl" style={{ perspective: 1400 }}>
        {[achievements.slice(0, 4), achievements.slice(4)].map((row, rowIndex) => (
          <div
            key={rowIndex}
            className={`flex w-full flex-wrap justify-center gap-5 ${rowIndex === 1 ? "mt-6" : ""}`}
          >
            {row.map((a, cardIndex) => {
              const i = rowIndex === 0 ? cardIndex : cardIndex + 4;
              const Icon = icons[a.kind];
              return (
                <FadeIn
                  key={`${a.title}-${i}`}
                  delay={i * 0.1}
                  className="w-full min-[768px]:w-[calc((100%_-_20px)/2)] min-[1200px]:w-[calc((100%_-_60px)/4)]"
                >
                  <Tilt>
                    <button
                      onClick={() => setSel(i)}
                      className="glass group flex h-auto min-h-[274px] w-full flex-col items-center gap-5 rounded-[32px] p-8 text-center transition-colors hover:border-signal/50"
                    >
                      <motion.div
                        animate={{ rotateY: [-12, 12, -12] }}
                        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: i }}
                        className={cn(
                          "flex size-24 items-center justify-center rounded-full shadow-2xl",
                          i < 2 ? "metal-gold" : "metal-silver",
                        )}
                      >
                        <Icon className="size-10 text-background" strokeWidth={1.6} />
                      </motion.div>
                      <div className="flex flex-col items-center gap-2">
                        <p className="font-display text-2xl font-bold leading-tight">{a.title}</p>
                        <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                          {a.detail}
                        </p>
                      </div>
                    </button>
                  </Tilt>
                </FadeIn>
              );
            })}
          </div>
        ))}
      </div>
      <AnimatePresence>
        {sel !== null && (
          <motion.div className="fixed inset-0 z-[80] flex items-center justify-center bg-background/80 p-5 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSel(null)}>
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} onClick={(e) => e.stopPropagation()} role="dialog" aria-modal className="relative w-full max-w-lg rounded-[32px] border border-line-strong bg-bg2 p-8">
              <button onClick={() => setSel(null)} aria-label="Close" className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full border border-line"><X className="size-5" /></button>
              <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-line-strong text-muted-foreground"><ImageIcon className="size-5" /></div>
              <p className="mt-6 font-display text-3xl font-bold">{achievements[sel]!.title}</p>
              <p className="mt-2 text-muted-foreground">{achievements[sel]!.detail}</p>
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
  useMotionValueEvent(scrollYProgress, "change", (v) => { const n = Math.round(v * (journey.length - 1)); setLit((p) => (p === n ? p : n)); });
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
            <PrimaryButton href={resume.url} target="_blank" rel="noreferrer">View PDF</PrimaryButton>
            <GhostButton href={resume.url} download>Download PDF</GhostButton>
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
