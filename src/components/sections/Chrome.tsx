import { motion, useScroll, useSpring, useTransform, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { PrimaryButton } from "@/components/ui/kit";
import { cn } from "@/lib/utils";

const links = [["Work", "work"], ["About", "about"], ["Skills", "skills"], ["Experience", "experience"], ["Achievements", "achievements"], ["Resume", "resume"]] as const;

export function BackgroundLayer() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, (v) => v * -0.1);
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-0">
      <div className="tech-grid absolute inset-0" />
      <motion.svg style={{ y }} className="absolute inset-0 h-[200%] w-full opacity-[0.05]" preserveAspectRatio="none">
        <defs>
          <pattern id="traces" width="240" height="240" patternUnits="userSpaceOnUse">
            <path d="M0 40 H80 L110 70 H240 M40 0 V120 L70 150 V240 M160 240 V180 L190 150 H240" stroke="var(--signal)" fill="none" />
            <circle cx="110" cy="70" r="3" fill="var(--signal)" /><circle cx="70" cy="150" r="3" fill="var(--signal)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#traces)" />
      </motion.svg>
    </div>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  return <motion.div style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-0.5 origin-left bg-signal" />;
}

function useScrollSpy() {
  const [active, setActive] = useState<string>("");
  useEffect(() => {
    const obs = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-45% 0px -50% 0px" });
    links.forEach(([, id]) => { const el = document.getElementById(id); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);
  return active;
}

export function Navbar() {
  const active = useScrollSpy();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { const f = () => setScrolled(window.scrollY > 40); f(); window.addEventListener("scroll", f, { passive: true }); return () => window.removeEventListener("scroll", f); }, []);
  useEffect(() => { document.body.style.overflow = open ? "hidden" : ""; }, [open]);
  return (
    <motion.header initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="fixed inset-x-0 top-0 z-50 px-4 pt-5 md:px-10">
      <nav className={cn("mx-auto flex max-w-7xl items-center justify-between rounded-full border border-line px-3 py-2 backdrop-blur-xl transition-colors md:px-4", scrolled ? "bg-background/85" : "bg-background/40")}>
        <a href="#top" aria-label="Home" className="relative flex h-9 w-12 items-center justify-center overflow-hidden rounded-md border border-signal/60 bg-transparent p-1 font-mono text-sm font-medium text-signal">
          <img src="/assets/prajith-logo.png" alt="K. Prajith Raj" className="h-full w-full rounded-[inherit] object-contain" />
          <span className="absolute -left-1.5 top-2 h-px w-1.5 bg-signal/60" /><span className="absolute -left-1.5 bottom-2 h-px w-1.5 bg-signal/60" />
          <span className="absolute -right-1.5 top-2 h-px w-1.5 bg-signal/60" /><span className="absolute -right-1.5 bottom-2 h-px w-1.5 bg-signal/60" />
        </a>
        <ul className="hidden items-center gap-6 lg:flex">
          {links.map(([l, id]) => (
            <li key={id}>
              <a href={`#${id}`} className="relative flex items-center gap-1.5 py-1 font-mono text-xs uppercase tracking-wider text-foreground transition-opacity duration-200 hover:opacity-70">
                <span className={cn("size-1 rounded-full bg-signal transition-opacity", active === id ? "opacity-100" : "opacity-0")} />
                {l}
                <span className={cn("absolute -bottom-0.5 left-2.5 right-0 h-px origin-left bg-signal transition-transform duration-300", active === id ? "scale-x-100" : "scale-x-0")} />
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          <PrimaryButton href="#contact" size="sm" className="hidden sm:inline-flex">Contact</PrimaryButton>
          <button aria-label="Open menu" onClick={() => setOpen(true)} className="flex size-11 items-center justify-center rounded-full border border-line lg:hidden"><Menu className="size-5" /></button>
        </div>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] flex flex-col bg-background px-6 pb-10 pt-6">
            <div className="flex justify-end"><button aria-label="Close menu" onClick={() => setOpen(false)} className="flex size-11 items-center justify-center rounded-full border border-line"><X className="size-5" /></button></div>
            <ul className="mt-10 flex flex-1 flex-col gap-5">
              {links.map(([l, id], i) => (
                <motion.li key={id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
                  <a href={`#${id}`} onClick={() => setOpen(false)} className="font-display text-4xl font-bold uppercase">{l}</a>
                </motion.li>
              ))}
            </ul>
            <div onClick={() => setOpen(false)}><PrimaryButton href="#contact" className="w-full">Contact</PrimaryButton></div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
