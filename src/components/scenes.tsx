import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { SceneKey, SkillViz } from "@/data/portfolio";

const S = "var(--signal)", RF = "var(--rf)", L = "var(--line-strong)", M = "var(--muted-fg)", W = "var(--warn)";
const mono = { fontFamily: "var(--font-mono)" } as const;

/** Isometric PCB used in About, hero fallback and default skill view. */
export function PcbBoard({ className, labels = false }: { className?: string; labels?: boolean }) {
  return (
    <svg viewBox="0 0 400 300" className={className} fill="none">
      <g transform="translate(200 150) scale(1 0.58) rotate(-30)">
        <rect x="-140" y="-100" width="280" height="200" rx="10" fill="var(--signal-deep)" stroke={S} strokeOpacity=".5" />
        {Array.from({ length: 9 }).map((_, i) => (
          <path key={i} d={`M-130 ${-80 + i * 20} H${-60 + (i % 3) * 15} L${-40 + (i % 3) * 15} ${-70 + i * 18} H120`} stroke={S} strokeOpacity=".35" strokeWidth="1.2" />
        ))}
        <rect x="-40" y="-40" width="80" height="80" rx="4" fill="var(--background)" stroke={S} />
        {Array.from({ length: 8 }).map((_, i) => (
          <g key={i}>
            <rect x={-36 + i * 10} y="-48" width="4" height="8" fill={M} />
            <rect x={-36 + i * 10} y="40" width="4" height="8" fill={M} />
            <rect x="-48" y={-36 + i * 10} width="8" height="4" fill={M} />
            <rect x="40" y={-36 + i * 10} width="8" height="4" fill={M} />
          </g>
        ))}
        <motion.circle r="10" fill={S} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2.4, repeat: Infinity }} />
        <rect x="70" y="-80" width="50" height="30" rx="3" fill="var(--panel)" stroke={L} />
        <rect x="-120" y="50" width="40" height="36" rx="3" fill="var(--panel)" stroke={L} />
        <path d="M110 60 v30 M118 60 v30" stroke={RF} strokeWidth="3" />
        {[0, 1, 2].map((i) => (
          <motion.circle key={i} cx={-100 + i * 16} cy="-80" r="4" fill={i === 1 ? W : S} animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.6, delay: i * 0.4, repeat: Infinity }} />
        ))}
      </g>
      {labels && (
        <g style={mono} fontSize="9" fill={M}>
          <text x="210" y="60">MCU // ESP32</text><path d="M205 63 L200 130" stroke={L} />
          <text x="300" y="130">SENSOR</text><path d="M298 127 L270 140" stroke={L} />
          <text x="40" y="210">ANTENNA</text><path d="M85 207 L120 190" stroke={L} />
        </g>
      )}
    </svg>
  );
}

function RfRings({ cx, cy, r = 30, color = RF, n = 3, dur = 3 }: { cx: number; cy: number; r?: number; color?: string; n?: number; dur?: number }) {
  return (
    <>
      {Array.from({ length: n }).map((_, i) => (
        <motion.circle key={i} cx={cx} cy={cy} r={r} stroke={color} strokeWidth="1.2" fill="none"
          initial={{ scale: 0.2, opacity: 0.8 }} animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: dur, delay: (i * dur) / n, repeat: Infinity, ease: "easeOut" }}
          style={{ transformOrigin: `${cx}px ${cy}px` }} />
      ))}
    </>
  );
}

function LoraTunnel() {
  const nodes = [60, 150, 240, 330, 420];
  return (
    <svg viewBox="0 0 480 300" className="h-full w-full">
      <rect width="480" height="300" fill="var(--strata-2)" />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M0 ${30 + i * 18} Q120 ${20 + i * 20} 240 ${32 + i * 17} T480 ${28 + i * 18}`} stroke="var(--strata)" strokeWidth="10" fill="none" />)}
      <rect x="0" y="150" width="480" height="110" fill="var(--background)" opacity=".85" />
      {[40, 130, 220, 310, 400].map((x) => <path key={x} d={`M${x} 260 V155 H${x + 40} V260`} stroke="var(--strata)" strokeWidth="5" fill="none" />)}
      {[0, 1, 2].map((i) => <path key={i} d={`M0 ${270 + i * 10} H480`} stroke="var(--strata)" strokeWidth="6" />)}
      <path d={`M${nodes[0]} 200 ${nodes.map((x) => `L${x} 200`).join(" ")}`} stroke={S} strokeOpacity=".3" strokeDasharray="4 4" />
      {nodes.map((x, i) => (
        <g key={x}>
          <RfRings cx={x} cy={200} r={36} dur={3} n={2} />
          <rect x={x - 7} y={193} width="14" height="14" rx="2" fill="var(--panel)" stroke={S} />
          <text x={x} y={228} textAnchor="middle" fontSize="8" fill={M} style={mono}>N{i + 1}</text>
        </g>
      ))}
      <motion.circle r="3.5" cy="200" fill={S} className="glow-dot" animate={{ cx: nodes }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
      <motion.circle r="5" cy="244" fill={W} animate={{ cx: [70, 400, 70] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
      <g style={mono} fontSize="10" fill={M}>
        <text x="20" y="22">GPS: NO SIGNAL</text><path d="M18 18 L112 18" stroke={W} />
        <text x="150" y="22">WI-FI: NO SIGNAL</text><path d="M148 18 L256 18" stroke={W} />
        <text x="330" y="22" fill={S}>LoRa MESH: 2 KM</text>
      </g>
    </svg>
  );
}

function PowerMeter() {
  const [t, setT] = useState(0);
  useEffect(() => { const id = setInterval(() => setT((v) => v + 1), 700); return () => clearInterval(id); }, []);
  const fault = t % 12 >= 9;
  const v = fault ? 262 + (t % 3) : 229 + ((t * 7) % 5);
  const i = fault ? 0 : 4.1 + ((t * 3) % 5) / 10;
  const readings = [["VOLTAGE", `${v.toFixed(0)} V`], ["CURRENT", `${i.toFixed(2)} A`], ["POWER", `${(v * i).toFixed(0)} W`], ["ENERGY", `${(12.4 + t * 0.01).toFixed(2)} kWh`]];
  return (
    <svg viewBox="0 0 480 300" className="h-full w-full">
      <rect x="30" y="30" width="250" height="240" rx="18" fill="var(--panel)" stroke={L} />
      <rect x="48" y="48" width="214" height="120" rx="8" fill="var(--background)" stroke={L} />
      {readings.map(([k, val], idx) => (
        <g key={k} style={mono}>
          <text x={60 + (idx % 2) * 104} y={72 + Math.floor(idx / 2) * 52} fontSize="8" fill={M}>{k}</text>
          <text x={60 + (idx % 2) * 104} y={92 + Math.floor(idx / 2) * 52} fontSize="16" fill={fault && idx < 2 ? W : S}>{val}</text>
        </g>
      ))}
      <motion.path d="M48 220 Q70 190 92 220 T136 220 T180 220 T224 220 T268 220" stroke={S} fill="none" strokeWidth="2"
        animate={{ x: [0, -44] }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} clipPath="inset(0)" />
      <text x="48" y="256" fontSize="9" fill={fault ? W : M} style={mono}>{fault ? "FAULT: OVERVOLTAGE → RELAY OPEN" : "STATUS: NOMINAL"}</text>
      <path d="M280 150 H330" stroke={S} strokeDasharray="3 3" />
      <rect x="330" y="120" width="70" height="60" rx="6" fill="var(--signal-deep)" stroke={S} />
      <text x="365" y="154" textAnchor="middle" fontSize="10" fill={S} style={mono}>ESP32</text>
      <path d="M400 150 H420 V200" stroke={L} />
      <rect x="400" y="200" width="50" height="40" rx="4" fill="var(--panel)" stroke={fault ? W : L} />
      <motion.path d="M410 225 L440 225" stroke={fault ? W : S} strokeWidth="3" animate={{ rotate: fault ? -25 : 0 }} style={{ transformOrigin: "410px 225px" }} />
      <text x="425" y="256" textAnchor="middle" fontSize="8" fill={M} style={mono}>RELAY</text>
    </svg>
  );
}

function EvCharger() {
  return (
    <svg viewBox="0 0 480 300" className="h-full w-full">
      <path d="M0 250 H480" stroke={L} />
      <rect x="50" y="70" width="80" height="180" rx="12" fill="var(--panel)" stroke={L} />
      <rect x="62" y="90" width="56" height="60" rx="6" fill="var(--background)" stroke={S} strokeOpacity=".6" />
      <text x="90" y="116" textAnchor="middle" fontSize="8" fill={S} style={mono}>ESP32</text>
      <text x="90" y="134" textAnchor="middle" fontSize="8" fill={M} style={mono}>CTRL</text>
      <path id="cable" d="M130 170 C200 170 220 230 290 200" stroke={M} strokeWidth="5" fill="none" />
      {[0, 1, 2].map((i) => (
        <motion.circle key={i} r="4" fill={S} className="glow-dot" style={{ offsetPath: "path('M130 170 C200 170 220 230 290 200')" } as any}
          animate={{ offsetDistance: ["0%", "100%"] }} transition={{ duration: 1.8, delay: i * 0.6, repeat: Infinity, ease: "linear" }} />
      ))}
      <path d="M270 210 Q300 160 360 160 H410 Q450 165 455 210 V230 H270 Z" fill="var(--bg-2)" stroke={L} />
      <circle cx="310" cy="232" r="16" fill="var(--background)" stroke={L} />
      <circle cx="420" cy="232" r="16" fill="var(--background)" stroke={L} />
      <path d="M90 70 V30 H300" stroke={RF} strokeDasharray="4 4" fill="none" />
      <path d="M300 18 a14 14 0 0 1 26 -4 a12 12 0 0 1 18 12 h-50 a8 8 0 0 1 6 -8z" fill="var(--panel)" stroke={RF} />
      <motion.circle r="3" fill={RF} animate={{ cx: [90, 90, 300], cy: [70, 30, 30] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
      <text x="360" y="30" fontSize="9" fill={M} style={mono}>CLOUD SYNC</text>
    </svg>
  );
}

function ParkingLot() {
  const [occ, setOcc] = useState([1, 0, 1, 1, 0, 0, 1, 0]);
  useEffect(() => { const id = setInterval(() => setOcc((o) => o.map((v, i) => (i === Math.floor(Math.random() * 8) ? 1 - v : v))), 1400); return () => clearInterval(id); }, []);
  return (
    <svg viewBox="0 0 480 300" className="h-full w-full">
      <rect x="40" y="40" width="340" height="220" rx="10" fill="var(--bg-2)" stroke={L} />
      {occ.map((o, i) => {
        const x = 60 + (i % 4) * 80, y = i < 4 ? 55 : 170;
        return (
          <g key={i}>
            <rect x={x} y={y} width="60" height="75" fill="none" stroke={M} strokeOpacity=".5" />
            <motion.rect x={x + 12} y={y + 10} width="36" height="55" rx="6" fill="var(--panel)" stroke={L} animate={{ opacity: o ? 1 : 0, y: o ? y + 10 : y - 20 }} />
            <rect x={x + 3} y={y + 3} width="54" height="69" fill="none" strokeWidth="2" stroke={o ? W : S} />
          </g>
        );
      })}
      <path d="M210 20 L60 140 L360 140 Z" fill={S} opacity=".06" />
      <motion.path d="M40 0 H380" stroke={S} strokeOpacity=".6" animate={{ y: [40, 260, 40] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
      <rect x="200" y="10" width="20" height="14" rx="3" fill="var(--panel)" stroke={S} />
      <rect x="400" y="100" width="64" height="100" rx="8" fill="var(--panel)" stroke={L} />
      <text x="432" y="122" textAnchor="middle" fontSize="8" fill={M} style={mono}>FREE</text>
      <text x="432" y="146" textAnchor="middle" fontSize="20" fill={S} style={mono}>{occ.filter((o) => !o).length}</text>
      <text x="432" y="176" textAnchor="middle" fontSize="8" fill={M} style={mono}>/ 8 SLOTS</text>
    </svg>
  );
}

function CowTracker() {
  return (
    <svg viewBox="0 0 480 300" className="h-full w-full">
      <path d="M0 220 L90 170 L180 205 L280 150 L380 195 L480 160 V300 H0 Z" fill="var(--bg-2)" stroke={L} />
      <path d="M0 250 L120 215 L240 245 L360 210 L480 240 V300 H0 Z" fill="var(--panel)" />
      <g transform="translate(150 200)">
        <rect x="0" y="0" width="70" height="34" rx="12" fill="var(--foreground)" opacity=".85" />
        <rect x="60" y="-12" width="26" height="22" rx="7" fill="var(--foreground)" opacity=".85" />
        <rect x="8" y="30" width="6" height="18" fill="var(--foreground)" opacity=".7" /><rect x="54" y="30" width="6" height="18" fill="var(--foreground)" opacity=".7" />
        <rect x="70" y="10" width="8" height="8" rx="1" fill={S} />
        <RfRings cx={74} cy={14} r={30} color={S} n={2} dur={2.4} />
      </g>
      <path d="M400 30 l16 -8 l8 16 l-16 8z" fill="var(--panel)" stroke={RF} />
      <text x="380" y="62" fontSize="8" fill={M} style={mono}>GPS SAT</text>
      <motion.path d="M410 40 L228 210" stroke={RF} strokeDasharray="4 6" animate={{ strokeDashoffset: [0, -20] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
      <rect x="30" y="30" width="130" height="90" rx="8" fill="var(--background)" stroke={L} />
      <path d="M40 60 H150 M40 90 H150 M70 40 V110 M110 40 V110" stroke={L} />
      <motion.circle r="5" fill={S} className="glow-dot" animate={{ cx: [60, 120, 95, 60], cy: [95, 60, 85, 95] }} transition={{ duration: 8, repeat: Infinity }} />
      <text x="40" y="136" fontSize="8" fill={M} style={mono}>LIVE TRACKING</text>
      <motion.path d="M224 200 Q190 140 160 110" stroke={S} strokeDasharray="3 5" fill="none" animate={{ strokeDashoffset: [0, -16] }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
    </svg>
  );
}

export function ProjectScene({ scene }: { scene: SceneKey }) {
  switch (scene) {
    case "lora": return <LoraTunnel />;
    case "meter": return <PowerMeter />;
    case "ev": return <EvCharger />;
    case "parking": return <ParkingLot />;
    case "cow": return <CowTracker />;
  }
}

/* ---------- Skill viewer visuals ---------- */
function Bus({ lines, label }: { lines: string[]; label: string }) {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full">
      <rect x="20" y="100" width="70" height="100" rx="8" fill="var(--signal-deep)" stroke={S} />
      <text x="55" y="154" textAnchor="middle" fontSize="10" fill={S} style={mono}>MCU</text>
      <rect x="310" y="100" width="70" height="100" rx="8" fill="var(--panel)" stroke={L} />
      <text x="345" y="154" textAnchor="middle" fontSize="10" fill={M} style={mono}>PERIPH</text>
      {lines.map((ln, i) => {
        const y = 150 - ((lines.length - 1) * 22) / 2 + i * 22;
        const clock = /SCL|SCLK/.test(ln);
        return (
          <g key={ln}>
            <text x="200" y={y - 5} textAnchor="middle" fontSize="8" fill={M} style={mono}>{ln}</text>
            <path d={`M90 ${y} H310`} stroke={L} />
            {clock ? (
              <motion.path d={`M90 ${y} ${Array.from({ length: 11 }).map((_, k) => `h10 v-6 h10 v6`).join(" ")}`} stroke={RF} fill="none" animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity }} />
            ) : ln === "CS" ? (
              <motion.path d={`M90 ${y - 6} H140 V${y} H260 V${y - 6} H310`} stroke={W} fill="none" />
            ) : (
              [0, 1, 2].map((k) => (
                <motion.rect key={k} y={y - 3} width="10" height="6" rx="1" fill={ln.includes("MISO") || ln === "RX" ? RF : S}
                  animate={{ x: ln.includes("MISO") || ln === "RX" ? [300, 90] : [90, 300] }} transition={{ duration: 2, delay: k * 0.6, repeat: Infinity, ease: "linear" }} />
              ))
            )}
          </g>
        );
      })}
      <text x="200" y="270" textAnchor="middle" fontSize="11" fill={S} style={mono}>{label}</text>
    </svg>
  );
}

export function SkillVisual({ viz, name }: { viz: SkillViz | null; name: string | null }) {
  if (!viz) return <div className="flex h-full items-center justify-center"><motion.div animate={{ rotate: [0, 3, -3, 0] }} transition={{ duration: 10, repeat: Infinity }} className="w-full"><PcbBoard labels className="w-full" /></motion.div></div>;
  switch (viz) {
    case "board": return <motion.div key={name} initial={{ y: 30, opacity: 0, rotateX: 20 }} animate={{ y: 0, opacity: 1, rotateX: 0 }} className="flex h-full flex-col items-center justify-center"><PcbBoard className="w-full" /><p className="mono-label text-signal">{name}</p></motion.div>;
    case "i2c": return <Bus lines={["SDA", "SCL"]} label="I²C // 2-WIRE, ADDRESSED" />;
    case "spi": return <Bus lines={["MOSI", "MISO", "SCLK", "CS"]} label="SPI // SYNCHRONOUS, FULL-DUPLEX" />;
    case "uart": return <Bus lines={["TX", "RX"]} label={`${name === "MODBUS" ? "MODBUS" : "UART"} // START · DATA · STOP`} />;
    case "mqtt":
      return (
        <svg viewBox="0 0 400 300" className="h-full w-full">
          {[["PUBLISHER", 60], ["BROKER", 200], ["SUBSCRIBER", 340]].map(([l, x]) => (
            <g key={l as string}><rect x={(x as number) - 45} y="125" width="90" height="50" rx="10" fill={l === "BROKER" ? "var(--signal-deep)" : "var(--panel)"} stroke={l === "BROKER" ? S : L} /><text x={x as number} y="154" textAnchor="middle" fontSize="9" fill={l === "BROKER" ? S : M} style={mono}>{l}</text></g>
          ))}
          <path d="M105 150 H155 M245 150 H295" stroke={L} />
          {[0, 1].map((k) => <motion.circle key={k} r="4" cy="150" fill={S} className="glow-dot" animate={{ cx: [105, 155, 245, 295] }} transition={{ duration: 2.4, delay: k * 1.2, repeat: Infinity, ease: "linear" }} />)}
          <text x="200" y="220" textAnchor="middle" fontSize="10" fill={M} style={mono}>topic: sensors/meter/voltage</text>
        </svg>
      );
    case "lora":
      return (
        <svg viewBox="0 0 400 300" className="h-full w-full">
          <RfRings cx={90} cy={150} r={120} n={4} dur={4} />
          <rect x="75" y="135" width="30" height="30" rx="4" fill="var(--signal-deep)" stroke={S} /><path d="M90 135 V105" stroke={S} strokeWidth="2" />
          <rect x="300" y="135" width="30" height="30" rx="4" fill="var(--panel)" stroke={RF} /><path d="M315 135 V105" stroke={RF} strokeWidth="2" />
          <text x="200" y="260" textAnchor="middle" fontSize="10" fill={S} style={mono}>SX1276 // SUB-GHz // LONG RANGE</text>
        </svg>
      );
    case "cv":
      return (
        <svg viewBox="0 0 400 300" className="h-full w-full">
          <rect x="50" y="40" width="300" height="200" rx="10" fill="var(--bg-2)" stroke={L} />
          {[[80, 150, 70, 60, S], [180, 140, 70, 70, W], [270, 150, 60, 60, S]].map(([x, y, w, h, c], i) => (
            <motion.rect key={i} x={x as number} y={y as number} width={w as number} height={h as number} fill="none" stroke={c as string} strokeWidth="2" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: 3, delay: i * 0.4, repeat: Infinity }} />
          ))}
          <motion.path d="M50 0 H350" stroke={S} animate={{ y: [40, 240, 40] }} transition={{ duration: 3, repeat: Infinity, ease: "linear" }} />
          <text x="200" y="270" textAnchor="middle" fontSize="10" fill={S} style={mono}>OpenCV // DETECT · CLASSIFY</text>
        </svg>
      );
    case "adc": {
      const sine = Array.from({ length: 41 }).map((_, i) => `${i ? "L" : "M"}${40 + i * 8} ${150 - Math.sin(i / 3) * 60}`).join(" ");
      const steps = Array.from({ length: 21 }).map((_, i) => { const y = 150 - Math.round(Math.sin((i * 2) / 3) * 4) * 15; return `${i ? "L" : "M"}${40 + i * 16} ${y} H${56 + i * 16}`; }).join(" ");
      return (
        <svg viewBox="0 0 400 300" className="h-full w-full">
          <motion.path d={sine} stroke={RF} fill="none" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }} />
          <motion.path d={steps} stroke={S} fill="none" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.6 }} />
          <text x="200" y="270" textAnchor="middle" fontSize="10" fill={S} style={mono}>ANALOG → SAMPLED DIGITAL LEVELS</text>
        </svg>
      );
    }
    case "code":
    case "web": {
      const lines = viz === "web"
        ? ["// supporting: hardware → dashboard", "mqtt.on('message', (t, v) => {", "  db.readings.insert({ t, v });", "  io.emit('live', v);", "});"]
        : ["volatile uint16_t adc_val;", "void IRAM_ATTR isr_sample() {", "  adc_val = adc1_get_raw(CH0);", "  if (adc_val > V_MAX) relay_off();", "}"];
      return (
        <div className="flex h-full flex-col justify-center gap-2 p-6 font-mono text-xs sm:text-sm">
          {lines.map((l, i) => <motion.p key={l} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className={i === 0 ? "text-muted-foreground" : "text-signal"}>{l}</motion.p>)}
          <p className="mono-label mt-4">{name}</p>
        </div>
      );
    }
  }
}
