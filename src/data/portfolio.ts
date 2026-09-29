export const profile = {
  name: "K. Prajith Raj",
  email: "kprajithraj@gmail.com",
  linkedin: "https://linkedin.com/in/prajith-raj-aab3382ba",
  linkedinLabel: "linkedin.com/in/prajith-raj-aab3382ba",
  github: "https://github.com/prajithraj28",
  githubLabel: "github.com/prajithraj28",
};

export type SkillViz = "board" | "i2c" | "spi" | "uart" | "mqtt" | "lora" | "cv" | "adc" | "code" | "web";

export const skillGroups: { title: string; note?: string; items: { name: string; viz: SkillViz }[] }[] = [
  {
    title: "Microcontrollers & Boards",
    items: [
      { name: "ESP32", viz: "board" }, { name: "STM32", viz: "board" }, { name: "Arduino Uno/Nano", viz: "board" },
      { name: "Raspberry Pi", viz: "board" }, { name: "Embedded C", viz: "code" },
      { name: "Real-time sensor/actuator control", viz: "board" }, { name: "RTOS", viz: "code" },
    ],
  },
  {
    title: "Interfacing Protocols",
    items: [
      { name: "I²C", viz: "i2c" }, { name: "SPI", viz: "spi" }, { name: "UART", viz: "uart" },
      { name: "MQTT", viz: "mqtt" }, { name: "MODBUS", viz: "uart" },
    ],
  },
  {
    title: "Programming & Vision",
    items: [{ name: "C", viz: "code" }, { name: "C++", viz: "code" }, { name: "OpenCV", viz: "cv" }, { name: "Python (basic)", viz: "code" }],
  },
  {
    title: "Electronics & Design",
    items: [
      { name: "Analog circuits", viz: "adc" }, { name: "ADC/DAC", viz: "adc" }, { name: "Signal conditioning", viz: "adc" },
      { name: "QNX", viz: "code" }, { name: "MATLAB", viz: "adc" }, { name: "Simulink", viz: "adc" },
      { name: "Proteus", viz: "board" }, { name: "EasyEDA (schematic/PCB)", viz: "board" }, { name: "Keil", viz: "code" },
      { name: "Memory management", viz: "code" },
    ],
  },
  {
    title: "Wireless",
    items: [{ name: "LoRa (SX1276)", viz: "lora" }, { name: "Sub-GHz", viz: "lora" }, { name: "Wireless communication", viz: "lora" }],
  },
  {
    title: "Software for Hardware Dashboards",
    note: "Supporting",
    items: [{ name: "React", viz: "web" }, { name: "Node.js", viz: "web" }, { name: "MongoDB", viz: "web" }],
  },
];

export type SceneKey = "lora" | "meter" | "ev" | "parking" | "cow";

export const projects: {
  key: SceneKey; title: string; category: string; tags: string[]; flow: string[];
  metrics: { value: string; label: string }[]; facts: string[];
  problem: string; approach: string; hardware: string; firmware: string; result: string;
}[] = [
  {
    key: "lora",
    title: "LoRa-Based Wireless Communication for Coal Miners",
    category: "Wireless // Sub-GHz Mesh",
    tags: ["ESP32", "LoRa SX1276", "Embedded C", "Sub-GHz", "Mesh Network"],
    flow: ["Underground", "No GPS/Wi-Fi", "LoRa link", "Mesh network", "Real-time data"],
    metrics: [{ value: "2 km", label: "Bidirectional range" }, { value: "~70%", label: "Fewer blackout zones" }],
    facts: [
      "Bidirectional data transmission over 2 km in GPS/Wi-Fi-denied underground environments.",
      "Eliminated communication blackouts during tunnel simulation tests.",
      "Embedded C firmware for real-time location updates over the mesh.",
    ],
    problem: "Underground mines have no GPS or Wi-Fi, leaving miners without a way to send location or data.",
    approach: "Build a sub-GHz LoRa mesh so every node can relay packets toward the surface.",
    hardware: "ESP32 nodes with LoRa SX1276 transceivers.",
    firmware: "Embedded C firmware handling mesh relaying and real-time location updates.",
    result: "2 km bidirectional links, blackout zones cut by ~70% in test scenarios.",
  },
  {
    key: "meter",
    title: "IoT-Based Digital Power Meter",
    category: "HPRCSELab, IIITDM Kancheepuram",
    tags: ["ESP32", "Sensors", "Embedded C", "IoT", "Relay", "Dashboard"],
    flow: ["Sensors", "ESP32", "Processing", "Fault detection", "Relay", "IoT dashboard"],
    metrics: [{ value: "±2%", label: "Measurement accuracy" }, { value: "<200 ms", label: "Relay cutoff" }, { value: "~60%", label: "Less manual inspection" }],
    facts: [
      "Real-time voltage/current/power/energy estimation across 3 load types.",
      "Threshold-based over/undervoltage fault detection with automatic relay cutoff.",
      "An embedded control loop closing sensing to actuation.",
    ],
    problem: "Electrical loads needed live monitoring and fast protection from voltage faults.",
    approach: "Measure V/I on an ESP32, estimate power and energy, and trip a relay on threshold violations.",
    hardware: "ESP32, voltage and current sensors, relay module.",
    firmware: "Sampling, estimation, threshold fault logic and IoT reporting.",
    result: "±2% accuracy across 3 load types, relay cutoff in under 200 ms, ~60% less manual inspection.",
  },
  {
    key: "ev",
    title: "Smart EV Charging Station",
    category: "Incax Technology",
    tags: ["ESP32", "IoT", "Sensors", "Cloud", "Embedded Firmware"],
    flow: ["EV", "Charging gun", "Embedded controller", "Energy monitoring", "Cloud"],
    metrics: [{ value: "~15%", label: "Faster charge cycle" }, { value: "50+", label: "Concurrent users" }],
    facts: [
      "Real-time ESP32 firmware handling live sensor data, cloud sync and user authentication.",
      "Energy-management control algorithm and responsive UI.",
      "Built for a functioning hardware prototype.",
    ],
    problem: "A charging station prototype needed reliable real-time control and cloud connectivity.",
    approach: "ESP32 firmware for sensing, authentication and cloud sync, plus an energy-management algorithm.",
    hardware: "ESP32 controller with charging-system sensors.",
    firmware: "Real-time sensor handling, cloud sync and control algorithm.",
    result: "Average charge-cycle time cut by ~15%, stable under 50+ concurrent users.",
  },
  {
    key: "parking",
    title: "Smart Parking Detection System",
    category: "Thoothukudi Police Hackathon",
    tags: ["Raspberry Pi", "OpenCV", "Python", "React", "MongoDB"],
    flow: ["Camera", "Raspberry Pi", "OpenCV", "Detection", "Web app"],
    metrics: [{ value: "92%", label: "Detection accuracy" }, { value: "200+", label: "Reservations" }, { value: "~30%", label: "Less congestion" }],
    facts: [
      "Camera-based occupancy detection on Raspberry Pi from live video.",
      "Camera interfacing and CV inference on embedded hardware.",
      "Detections connected to a React + MongoDB booking engine.",
    ],
    problem: "Drivers circling for spaces caused local congestion.",
    approach: "Run OpenCV occupancy detection on a Raspberry Pi and publish slot status to a booking app.",
    hardware: "Raspberry Pi with camera module.",
    firmware: "Python + OpenCV detection pipeline.",
    result: "92% accuracy, 200+ reservations processed, congestion reduced by ~30%.",
  },
  {
    key: "cow",
    title: "IoT-Based Smart Cow Identification & Tracking",
    category: "Tracking // RFID + GPS",
    tags: ["ESP32", "GPS", "RFID", "Wireless Communication", "C/C++"],
    flow: ["RFID ID", "GPS location", "ESP32", "Wireless link", "Live tracking"],
    metrics: [{ value: "Low-power", label: "ESP32 design" }, { value: "Real-time", label: "Tracking" }],
    facts: [
      "Low-power ESP32 sensor and RFID identification for continuous real-time tracking.",
      "Multiple sensors integrated through a unified wireless data pipeline.",
      "C/C++ firmware for sensor interfacing and communication.",
    ],
    problem: "Livestock needed identification and continuous location tracking.",
    approach: "Pair RFID identity with GPS location on an ESP32 and stream it wirelessly.",
    hardware: "ESP32, GPS module, RFID reader.",
    firmware: "C/C++ firmware for sensor interfacing and wireless communication.",
    result: "A unified wireless pipeline providing real-time tracking.",
  },
];

export const experience = [
  {
    company: "Incax Technology Pvt. Ltd., Chennai",
    role: "Embedded Systems & IoT Intern",
    dates: "Oct 2025 – Apr 2026",
    chips: ["ESP32", "Firmware", "Charging system", "Sensor data", "Energy management", "Cloud sync"],
    bullets: [
      "Built and deployed real-time ESP32 firmware for a full-stack Smart EV Charging Station.",
      "Energy-management control algorithm and UI cut average charge-cycle time by ~15% under 50+ concurrent users.",
    ],
  },
  {
    company: "HPRCSELab, IIITDM Kancheepuram",
    role: "Embedded Systems Intern",
    dates: "Jun 2025 – Jul 2025",
    chips: ["ESP32", "Power measurement", "Fault detection", "Relay control", "Real-time monitoring"],
    bullets: [
      "IoT Digital Power Meter holding ±2% accuracy across 3 load types.",
      "Over/undervoltage detection with relay cutoff under 200 ms; ~60% less manual inspection.",
    ],
  },
];

export const achievements = [
  { kind: "trophy", title: "1st Prize", detail: "CAG Ideathon (12-hour national hackathon)" },
  { kind: "medal", title: "2nd Place", detail: "Becrez'25 National Hackathon (₹5,000 prize + ₹24,000 in credits)" },
  { kind: "badge", title: "26th Rank", detail: "IIT Bombay International Hackathon 2026" },
  { kind: "plaque", title: "Shortlisted", detail: "Asia-Level Entrepreneurship Hackathon, IIT Bombay" },
] as const;

export const certifications = [
  { name: "Embedded Systems & IoT", issuer: "edX", embedded: true },
  { name: "Microcontrollers & Microprocessors", issuer: "Udemy", embedded: true },
  { name: "Embedded Systems", issuer: "Microchip", embedded: true },
  { name: "Python for Data Science", issuer: "NPTEL" },
  { name: "Database Management Systems", issuer: "NPTEL" },
  { name: "HTML, CSS & JavaScript", issuer: "Infosys Springboard" },
];

export const journey = ["ECE", "Electronics", "Microcontrollers", "Embedded Systems", "Sensors", "Communication", "Wireless / LoRa", "IoT", "Real-World Systems"];

export const marqueeRow1 = ["ESP32 // MCU", "STM32 // ARM", "Arduino Nano", "Raspberry Pi", "SX1276 // LoRa", "Sensor Breadboard", "Relay Module", "Scope Trace", "PCB // EasyEDA", "Antenna", "EV Charger", "Power Meter"];
export const marqueeRow2 = ["Tunnel LoRa Test", "Parking Camera", "RFID Reader", "GPS Module", "Dashboard", "Hackathon Stage", "MATLAB Plot", "Proteus Schematic", "Firmware Terminal", "Signal Chain"];
