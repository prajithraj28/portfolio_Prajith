import { createFileRoute } from "@tanstack/react-router";
import { BackgroundLayer, Navbar, ScrollProgress } from "@/components/sections/Chrome";
import { Hero, SignalMarquee } from "@/components/sections/Hero";
import { About, Philosophy, Skills } from "@/components/sections/AboutSkills";
import { Projects, Experience } from "@/components/sections/Work";
import { Product, Achievements, Certifications, Journey, Resume, Contact } from "@/components/sections/Closing";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "K. Prajith Raj -- Electronics & Communication Engineer" },
      { name: "description", content: "ECE undergraduate specialising in embedded systems, IoT, LoRa wireless communication and hardware-software integration." },
      { property: "og:title", content: "K. Prajith Raj -- Electronics & Communication Engineer" },
      { property: "og:description", content: "Embedded systems, IoT, LoRa and real-world hardware projects by K. Prajith Raj." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="relative" style={{ overflowX: "clip" }}>
      <ScrollProgress />
      <BackgroundLayer />
      <Navbar />
      <main className="relative">
        <Hero />
        <SignalMarquee />
        <About />
        <Philosophy />
        <Skills />
        <Projects />
        <Experience />
        <Product />
        <Achievements />
        <Certifications />
        <Journey />
        <Resume />
        <Contact />
      </main>
    </div>
  );
}
