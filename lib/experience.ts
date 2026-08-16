export type Role = {
  period: string;
  title: string;
  team?: string;
  location: string;
  summary?: string;
  href?: string;
  linkLabel?: string;
};

export type Employer = {
  company: string;
  period: string;
  roles: Role[];
};

export const employers: Employer[] = [
  {
    company: "Anduril Industries",
    period: "2025 — Present",
    roles: [
      {
        period: "May 2025 — Present",
        title: "Modeling, Simulation & Analysis Engineer",
        team: "Air Dominance & Strike",
        location: "Costa Mesa, CA",
        summary:
          "Hypersonic and cruise-missile 6DOF — physics models, GNC interfaces, and sim infrastructure. Monte Carlo and flight-test support; large speedups on the sim.",
      },
    ],
  },
  {
    company: "Northrop Grumman",
    period: "2022 — 2025",
    roles: [
      {
        period: "Aug 2023 — Apr 2025",
        title: "Pathways GNC Engineer",
        team: "Launch Vehicles",
        location: "Chandler, AZ",
        summary:
          "C++ 6DOF nav sources into a Kalman filter, plus divert-motor studies for thrust and sensor noise.",
      },
      {
        period: "Nov 2022 — Aug 2023",
        title: "Pathways RF Microwave Engineer",
        team: "Integration and Test",
        location: "Linthicum, MD",
        summary:
          "Test director for satellite antenna I&T. Day-to-day bench ops and training on a growing 20+ person line.",
      },
      {
        period: "Aug 2022 — Oct 2022",
        title: "Pathways Systems Engineer",
        team: "Airborne Multifunction Sensors",
        location: "Linthicum, MD",
        summary: "Gimbal modeling and simulation for EO/IR pointing.",
      },
    ],
  },
  {
    company: "Moog Aircraft",
    period: "2021 — 2022",
    roles: [
      {
        period: "Summers 2021, 2022",
        title: "Systems Engineering Intern",
        location: "Buffalo, NY",
        summary:
          "Simulation, then integration and test, of electric flight control actuators.",
      },
    ],
  },
  {
    company: "UB Drone Lab",
    period: "2020 — 2022",
    roles: [
      {
        period: "Apr 2020 — Jun 2022",
        title: "Undergraduate Researcher",
        team: "Drone Hunter",
        location: "Buffalo, NY",
        summary:
          "Solo anti-drone quadcopter: Pixhawk and Jetson Nano, pneumatic net over 8 ft.",
        href: "https://www.youtube.com/watch?v=nB1vAQlGqa4",
        linkLabel: "Flight demo",
      },
    ],
  },
];

export const education = [
  {
    period: "Dec 2025",
    school: "Purdue University",
    credential: "M.S. Aerospace Engineering",
    detail: "Astrodynamics & Space Systems",
  },
  {
    period: "Aug 2024",
    school: "Stevens Institute of Technology",
    credential: "Graduate Certificate, Space Systems Engineering",
  },
  {
    period: "Aug 2022",
    school: "University at Buffalo",
    credential: "B.S. Mechanical and Aerospace Engineering",
    detail: "Dual degree",
  },
];

export const licenses = [
  {
    period: "Dec 2023",
    name: "Remote UAS Pilot — Part 107",
    issuer: "Federal Aviation Administration",
  },
  {
    period: "Jun 2019",
    name: "Airframe & Powerplant",
    issuer: "Federal Aviation Administration",
  },
  {
    period: "—",
    name: "Secret / Top Secret",
    issuer: "U.S. Government",
  },
];

export const extras = [
  {
    period: "2026",
    title: "xAI Hackathon",
    detail: "Top 5 of 200+. GrokEye, 12 hours.",
  },
  {
    period: "2025",
    title: "xAI Hackathon",
    detail: "Grok for talent sourcing. 24 hours, 400+ competitors.",
  },
  {
    period: "2023",
    title: "NG Space Sweep",
    detail: "Top 3 of 16 teams. Solo radar-satellite pitch for debris under 1 cm².",
  },
  {
    period: "2022",
    title: "Gustav and Grete Zimmer Memorial Scholarship",
    detail: "University at Buffalo.",
  },
  {
    period: "2018",
    title: "UB Design, Build, Race",
    detail: "1st of 300+ engineering students.",
  },
];
