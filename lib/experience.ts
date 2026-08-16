export type Role = {
  period: string;
  title: string;
  team?: string;
  location: string;
  summary?: string;
  highlights?: string[];
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
        title: "Modeling & Simulation Engineer",
        team: "Air Dominance & Strike",
        location: "Costa Mesa, CA",
      },
    ],
  },
  {
    company: "Northrop Grumman",
    period: "2022 — 2025",
    roles: [
      {
        period: "Aug 2023 — Apr 2025",
        title: "Pathways Guidance Navigation & Control Engineer",
        team: "Launch Vehicles",
        location: "Chandler, AZ",
        highlights: [
          "C++ navigation-aiding models and flight algorithms for hypersonic vehicles in GPS-denied environments.",
          "Monte Carlo performance analysis, Kalman filter tuning, and GPS receiver work for rapid satellite acquisition.",
          "Modeled interceptor terminal-phase divert with thruster jet interaction and seeker error.",
        ],
      },
      {
        period: "Nov 2022 — Jul 2023",
        title: "Pathways RF Microwave Engineer",
        team: "Remote Sensing Payloads",
        location: "Washington DC–Baltimore",
        highlights: [
          "Test director for payload antenna hardware on a high-volume satellite constellation, from standing up the first bench through thermal cycle, ATP, and RF calibration — including EDU hardware and three flight antenna panels.",
          "Wrote the 200+ page bench-operator manual, RF link budgets, and data-trending scripts; grew a 6-to-20 engineer team for 24/7 test.",
          "Briefed I&T lessons to leadership and the SEIT community of practice.",
        ],
      },
      {
        period: "Aug 2022 — Oct 2022",
        title: "Pathways Systems Engineer",
        team: "Airborne Multifunction Sensors",
        location: "Washington DC–Baltimore",
        highlights: [
          "Modeling and simulation of a gimbal for EO/IR sensor pointing.",
        ],
      },
    ],
  },
  {
    company: "Moog Aircraft",
    period: "2021 — 2022",
    roles: [
      {
        period: "Jun — Aug 2022",
        title: "Systems Engineering Intern",
        location: "Buffalo, NY",
        highlights: [
          "Integration and test of electric flight control actuators for military aircraft.",
        ],
      },
      {
        period: "Jun — Aug 2021",
        title: "Systems Engineering Intern",
        location: "Buffalo, NY",
        highlights: [
          "Simulation and analysis of electric flight control actuators.",
        ],
      },
    ],
  },
  {
    company: "University at Buffalo",
    period: "2021 — 2022",
    roles: [
      {
        period: "Apr 2021 — Jun 2022",
        title: "Undergraduate Researcher",
        team: "Drone Hunter",
        location: "Buffalo, NY",
        highlights: [
          "Independently built a drone that fires a net to catch other drones.",
        ],
        href: "https://www.youtube.com/watch?v=nB1vAQlGqa4",
        linkLabel: "Flight demo",
      },
    ],
  },
];

export const education = [
  {
    period: "2024 — 2025",
    school: "Purdue University",
    credential: "M.S. Aerospace Engineering",
    detail: "Astrodynamics & Space Systems",
  },
  {
    period: "2018 — 2022",
    school: "University at Buffalo",
    credential: "B.S. Mechanical and Aerospace Engineering",
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
];

export const extras = [
  {
    period: "2026",
    title: "xAI Hackathon",
    detail: "Top 5 of 200+. Grok for augmented reality — GrokEye, 12 hours.",
  },
  {
    period: "2025",
    title: "xAI Hackathon",
    detail: "Grok for talent sourcing. 24 hours, 400+ competitors.",
  },
  {
    period: "2023",
    title: "NG Space Sweep",
    detail:
      "Top 3 of 16 teams. Solo pitch of a radar satellite for debris smaller than 1 cm².",
  },
  {
    period: "2022",
    title: "Gustav and Grete Zimmer Memorial Scholarship",
    detail: "University at Buffalo.",
  },
  {
    period: "2018",
    title: "UB Design, Build, Race",
    detail: "1st of 300+ engineering students. Small electric motor boat.",
  },
];
