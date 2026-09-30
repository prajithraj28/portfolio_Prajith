import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from "framer-motion";
import { Activity, Cpu, Radio, ToggleRight, ChevronDown } from "lucide-react";
import { useRef, useState } from "react";
import { AnimatedText, ChipTag, CountUp, FadeIn, FlowDiagram, GhostButton, MonoLabel, Tilt } from "@/components/ui/kit";
import { PcbBoard, SkillVisual } from "@/components/scenes";
import { skillGroups, type SkillViz } from "@/data/portfolio";
import resume from "@/assets/KPrajith_resume.pdf.asset.json";
import { cn } from "@/lib/utils";

const floatLabels = [
  ["ESP32", "left-[4%] top-[12%]", -80], ["STM32", "left-[10%] top-[30%]", -80], ["Arduino", "left-[3%] top-[52%]", -80],
  ["Raspberry Pi", "left-[8%] bottom-[18%]", -80], ["LoRa", "right-[5%] top-[12%]", 80], ["I²C", "right-[12%] top-[30%]", 80],
  ["SPI", "right-[4%] top-[48%]", 80], ["UART", "right-[10%] bottom-[20%]", 80], ["MQTT", "left-[22%] top-[6%]", -80],
  ["Sensors", "right-[24%] top-[6%]", 80], ["Embedded C", "left-[20%] bottom-[6%]", -80], ["OpenCV", "right-[22%] bottom-[6%]", 80],
] as const;

export function About() {
  return (
    <section id="about" className="relative flex min-h-screen flex-col items-center justify-center gap-16 overflow-hidden px-5 py-20 sm:gap-20 sm:px-8 md:gap-24 md:px-10">
      <div aria-hidden className="absolute inset-0 flex items-center justify-center opacity-25">
        <Tilt className="w-[min(900px,110vw)]"><PcbBoard className="w-full" /></Tilt>
      </div>
      {floatLabels.map(([l, pos, x], i) => (
        <FadeIn key={l} x={x} y={0} duration={0.9} delay={0.1 + (i % 4) * 0.07} className={cn("absolute hidden md:block", pos)}>
          <div className="glass animate-float rounded-full px-3 py-1 font-mono text-[0.68rem] uppercase tracking-wider text-muted-foreground" style={{ animationDelay: `${i * 0.5}s` }}>{l}</div>
        </FadeIn>
      ))}
      <div className="relative flex flex-col items-center gap-10 sm:gap-14 md:gap-16">
        <FadeIn y={40}><h2 className="hero-heading text-center font-bold uppercase leading-none tracking-tight" style={{ fontSize: "clamp(3rem,12vw,160px)" }}>About me</h2></FadeIn>
        <AnimatedText
          className="max-w-[560px] text-center font-medium leading-relaxed text-foreground"
          text="I am an Electronics & Communication Engineering student at St. Joseph's Institute of Technology, Chennai, who enjoys building real-world systems that connect hardware, firmware, communication and software. I work across ESP32, STM32 and Arduino, with I²C, SPI and UART interfacing, and I iterate in hardware-in-the-loop environments."
        />
      </div>
      <div className="relative flex w-full max-w-4xl flex-col items-center gap-12">
        <FlowDiagram nodes={["Hardware", "Firmware", "Communication", "Software"]} className="w-full" />
        <div className="grid w-full grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-4">
          {[["B.E. ECE", "2023–2027"], ["CGPA", "7.8/10"], ["Internships", "2"], ["Hackathon results", "4"]].map(([k, v]) => (
            <div key={k} className="bg-background/90 p-5 text-center">
              <p className="font-display text-3xl font-bold text-foreground"><CountUp value={v} /></p>
              <p className="mono-label mt-1">{k}</p>
            </div>
          ))}
        </div>
        <GhostButton href={resume.url} download>Download Resume</GhostButton>
      </div>
    </section>
  );
}

const phases = [
  { word: "Sense", Icon: Activity }, { word: "Process", Icon: Cpu }, { word: "Communicate", Icon: Radio }, { word: "Act", Icon: ToggleRight },
];

export function Philosophy() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => { const a = Math.min(3, Math.max(0, Math.floor(v * 4))); setActive((p) => (p === a ? p : a)); });
  const line = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <section ref={ref} aria-label="Engineering philosophy" className="relative h-[260vh] bg-bg2">
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-10 overflow-hidden px-5 sm:px-8 md:px-10">
        <MonoLabel index="02">Engineering philosophy</MonoLabel>
        <p className="max-w-2xl text-lg text-muted-foreground md:text-2xl">I enjoy building systems where a physical device has to sense, process, communicate and respond.</p>
        <div className="relative flex flex-col gap-2 md:gap-4">
          <div className="absolute bottom-2 left-[18px] top-2 w-px bg-line-strong md:left-[26px]">
            <motion.div style={{ height: line }} className="w-full bg-signal" />
          </div>
          {phases.map(({ word, Icon }, i) => (
            <div key={word} className={cn("flex items-center gap-4 transition-opacity duration-500 md:gap-8", i === active ? "opacity-100" : "opacity-30")}>
              <div className={cn("relative z-10 flex size-9 items-center justify-center rounded-full border bg-bg2 md:size-[54px]", i === active ? "border-signal text-signal" : "border-line-strong text-muted-foreground")}>
                <Icon className="size-4 md:size-6" />
              </div>
              <span className={cn("font-display font-bold uppercase leading-none tracking-tight transition-colors duration-500", i === active ? "text-signal" : "text-foreground")} style={{ fontSize: "clamp(2.4rem,9vw,120px)" }}>{word}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Skills() {
  const [sel, setSel] = useState<{ viz: SkillViz; name: string } | null>(null);
  const [openCat, setOpenCat] = useState(0);
  const viewer = (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[32px] border border-line-strong bg-background">
      <div className="tech-grid absolute inset-0" />
      <AnimatePresence mode="wait">
        <motion.div key={sel?.name ?? "idle"} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="relative h-full w-full">
          <SkillVisual viz={sel?.viz ?? null} name={sel?.name ?? null} />
        </motion.div>
      </AnimatePresence>
      <p className="mono-label absolute left-5 top-4">Viewer // {sel?.name ?? "hover a component"}</p>
    </div>
  );
  return (
    <section id="skills" className="relative z-10 rounded-t-[40px] bg-lab px-5 py-20 text-lab-ink sm:rounded-t-[50px] sm:px-8 sm:py-24 md:rounded-t-[60px] md:px-10 md:py-32">
      <FadeIn><h2 className="section-heading mb-16 text-center sm:mb-20 md:mb-28">Skills</h2></FadeIn>
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1fr_minmax(0,520px)]">
        <div>
          {skillGroups.map((g, i) => (
            <FadeIn key={g.title} delay={i * 0.1} className="border-t border-lab-ink/15 py-8 last:border-b sm:py-10 md:py-12">
              <button className="flex w-full items-start gap-5 text-left md:gap-8" onClick={() => setOpenCat(openCat === i ? -1 : i)} aria-expanded={openCat === i}>
                <span className="font-display font-bold leading-none" style={{ fontSize: "clamp(3rem,10vw,140px)" }}>{String(i + 1).padStart(2, "0")}</span>
                <span className="flex flex-1 items-center justify-between gap-3 pt-2">
                  <span className="font-display text-xl font-medium uppercase md:text-3xl">{g.title}{g.note && <span className="ml-3 align-middle font-mono text-xs tracking-widest opacity-60">({g.note})</span>}</span>
                  <ChevronDown className={cn("size-5 shrink-0 transition-transform lg:hidden", openCat === i && "rotate-180")} />
                </span>
              </button>
              <div className={cn("mt-5 flex-wrap gap-2 lg:!flex", openCat === i ? "flex" : "hidden")}>
                {g.items.map((it) => (
                  <button key={it.name} onMouseEnter={() => setSel(it)} onFocus={() => setSel(it)} onClick={() => setSel(it)}
                    className={cn("min-h-9 rounded-full border px-3.5 py-1.5 font-mono text-xs transition-colors", sel?.name === it.name ? "border-lab-ink bg-lab-ink text-lab" : "border-lab-ink/20 hover:border-lab-ink")}>
                    {it.name}
                  </button>
                ))}
              </div>
              {openCat === i && <div className="mt-6 lg:hidden">{viewer}</div>}
            </FadeIn>
          ))}
        </div>
        <div className="hidden lg:block"><div className="sticky top-32">{viewer}</div></div>
      </div>
    </section>
  );
}
