import { FadeIn, GhostButton, Magnet, PrimaryButton } from "@/components/ui/kit";
import { marqueeRow1, marqueeRow2 } from "@/data/portfolio";
import portrait from "@/assets/prajith-portrait.jpg.asset.json";
import { useEffect, useRef, useState } from "react";

const chips = [
  { label: "ESP32", pos: "left-[4%] top-[34%] sm:left-[18%]", mobile: true },
  { label: "LoRa SX1276", pos: "right-[4%] top-[30%] sm:right-[16%]", mobile: true },
  { label: "STM32", pos: "left-[14%] bottom-[30%] hidden md:flex", mobile: false },
  { label: "MQTT", pos: "right-[14%] bottom-[34%] hidden md:flex", mobile: false },
];

export function Hero() {
  return (
    <section id="top" className="relative flex h-screen min-h-[640px] flex-col overflow-x-clip pt-24">
      <FadeIn delay={0.1} y={-10} className="px-6 md:px-10">
        <p className="mono-label max-w-7xl">Embedded Systems • IoT • Wireless Communication • Hardware Integration</p>
      </FadeIn>
      <div className="relative mt-6 overflow-hidden sm:mt-4 md:mt-2">
        <FadeIn delay={0.15} y={40}>
          <h1 className="hero-heading w-full whitespace-nowrap text-center text-[13vw] font-bold uppercase leading-none tracking-tight sm:text-[12vw] md:text-[11vw] lg:text-[10.5vw]">
            K. Prajith Raj
          </h1>
        </FadeIn>
        <FadeIn delay={0.3} y={20}><p className="mono-label mt-2 text-center">Electronics & Communication Engineering</p></FadeIn>
      </div>

      {/* Portrait */}
      <div className="absolute left-1/2 top-1/2 z-10 w-[240px] -translate-x-1/2 -translate-y-1/2 sm:top-auto sm:bottom-0 sm:w-[340px] sm:translate-y-0 md:w-[400px] lg:w-[440px]">
        <div aria-hidden className="absolute left-1/2 top-[30%] -z-10 size-[120%] -translate-x-1/2 -translate-y-1/2">
          <div className="animate-rf absolute inset-0 rounded-full border border-rf/60" />
          <div className="animate-rf absolute inset-0 rounded-full border border-rf/40" style={{ animationDelay: "2s" }} />
        </div>
        <FadeIn delay={0.6} y={30}>
          <Magnet>
            <div className="overflow-hidden rounded-[32px] [mask-image:linear-gradient(to_bottom,black_65%,transparent)]">
              <img src={portrait.url} alt="K. Prajith Raj in a black blazer" className="aspect-[3/4] w-full object-cover object-top" />
            </div>
          </Magnet>
        </FadeIn>
      </div>

      {chips.map((c, i) => (
        <FadeIn key={c.label} delay={0.8 + i * 0.12} className={`absolute z-20 ${c.pos} ${c.mobile ? "flex" : ""}`}>
          <div className="glass animate-float flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[0.68rem] uppercase tracking-wider" style={{ animationDelay: `${i * 1.2}s` }}>
            <span className="glow-dot size-1.5 rounded-full bg-signal" />{c.label}
          </div>
        </FadeIn>
      ))}

      <div className="relative z-20 mt-auto flex items-end justify-between gap-4 px-6 pb-7 sm:pb-8 md:px-10 md:pb-10">
        <FadeIn delay={0.4} y={20}>
          <p className="max-w-[200px] font-light leading-snug text-muted-foreground sm:max-w-[280px] md:max-w-[340px]" style={{ fontSize: "clamp(0.75rem,1.4vw,1.1rem)" }}>
            Building connected systems from sensors and firmware to wireless communication and real-time applications.
          </p>
        </FadeIn>
        <FadeIn delay={0.5} y={20} className="flex flex-col items-end gap-3 lg:flex-row">
          <PrimaryButton href="#work">Explore My Work</PrimaryButton>
          <GhostButton href="#contact" className="hidden sm:inline-flex">Contact Me</GhostButton>
        </FadeIn>
      </div>
      <div aria-hidden className="absolute bottom-6 left-1/2 z-20 hidden h-12 w-px -translate-x-1/2 bg-line-strong lg:block">
        <span className="animate-scroll-dot glow-dot absolute -left-[2.5px] top-0 size-1.5 rounded-full bg-signal" />
      </div>
    </section>
  );
}

function Tile({ caption, i }: { caption: string; i: number }) {
  const hue = i % 3;
  return (
    <div className="glass relative h-[200px] w-[310px] shrink-0 overflow-hidden rounded-2xl sm:h-[270px] sm:w-[420px]">
      <svg viewBox="0 0 420 270" className="absolute inset-0 h-full w-full" aria-hidden>
        {Array.from({ length: 7 }).map((_, k) => (
          <path key={k} d={`M0 ${30 + k * 34} H${120 + ((k * 53 + i * 31) % 160)} l24 ${k % 2 ? 24 : -24} H420`} stroke={hue === 1 ? "var(--rf)" : "var(--signal)"} strokeOpacity=".22" fill="none" />
        ))}
        <rect x={150 + (i % 4) * 10} y="80" width="110" height="110" rx="8" fill="var(--panel)" stroke="var(--line-strong)" />
        <rect x={180 + (i % 4) * 10} y="110" width="50" height="50" rx="4" fill="var(--signal-deep)" stroke={hue === 2 ? "var(--warn)" : "var(--signal)"} strokeOpacity=".7" />
      </svg>
      <p className="absolute bottom-4 left-4 font-mono text-xs uppercase tracking-widest text-foreground">{caption}</p>
    </div>
  );
}

export function SignalMarquee() {
  const ref = useRef<HTMLElement>(null);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    const f = () => { const el = ref.current; if (!el) return; setOffset((window.scrollY - el.offsetTop + window.innerHeight) * 0.3); };
    f(); window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  const r1 = [...marqueeRow1, ...marqueeRow1, ...marqueeRow1];
  const r2 = [...marqueeRow2, ...marqueeRow2, ...marqueeRow2];
  return (
    <section ref={ref} aria-label="Hardware gallery" className="relative flex flex-col gap-3 overflow-hidden pb-10 pt-24 sm:pt-32 md:pt-40">
      <div className="flex gap-3" style={{ transform: `translateX(${offset - 200}px)`, willChange: "transform" }}>{r1.map((c, i) => <Tile key={i} caption={c} i={i} />)}</div>
      <div className="flex gap-3" style={{ transform: `translateX(${-(offset - 200)}px)`, willChange: "transform" }}>{r2.map((c, i) => <Tile key={i} caption={c} i={i + 5} />)}</div>
    </section>
  );
}
