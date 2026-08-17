import { hunterYouTube, streamClips, streamPoster, talentGrokYouTube } from "@/lib/stream";

export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectVideo = {
  /** Relative R2 key (joined with NEXT_PUBLIC_MEDIA_BASE_URL) or absolute mp4 URL */
  src?: string;
  muxPlaybackId?: string;
  streamId?: string;
  youtubeId?: string;
  caption?: string;
};

export type Project = {
  slug: string;
  title: string;
  year: string;
  role: string;
  summary: string;
  featured?: boolean;
  poster: string;
  gallery: string[];
  video?: ProjectVideo;
  links: ProjectLink[];
  stack: string[];
  problem: string;
  approach: string;
  outcome: string;
};

export const projects: Project[] = [
  {
    slug: "grokeye",
    title: "GrokEye",
    year: "2026",
    role: "AR product",
    featured: true,
    summary:
      "Hands-free Grok-augmented reality that watches through the camera, speaks the fix, and points at exactly where things go.",
    poster: "/media/projects/grokeye/poster.jpg",
    gallery: [
      "/media/projects/grokeye/coffee.jpg",
      "/media/projects/grokeye/ikea.jpg",
    ],
    video: {
      youtubeId: "lC4oP8kb9KE",
      streamId: "644b9bc822bc50f3d8c70801f5f4f938",
      caption: "Walkthrough from Grokathon 2026",
    },
    links: [
      { label: "GitHub", href: "https://github.com/dereky925/GrokEye" },
      {
        label: "Demo",
        href: "https://www.youtube.com/watch?v=lC4oP8kb9KE",
      },
    ],
    stack: [
      "React",
      "Vite",
      "Grok 4.5",
      "xAI TTS",
      "Web Speech API",
    ],
    problem:
      "Physical work is hands-busy. Looking down at a phone to follow a manual breaks flow, and a generic chatbot cannot point at the part in front of you.",
    approach:
      "GrokEye looks through a webcam or catalog clip, routes voice to Grok, and draws boxes plus connection arrows on the frame while Carina speaks the next move. Web how-tos become step JSON; “check my work” compares before and after frames. A local tracker keeps overlays glued as the video plays.",
    outcome:
      "Built for Grokathon 2026. Demoed live espresso portafilter coaching and IKEA assembly overlays—voice in, overlays on the part, spoken verdict on the step.",
  },
  {
    slug: "claudecode",
    title: "Claude Coin",
    year: "2026",
    role: "Trading systems",
    summary:
      "Momentum trading bot on Alpaca with an optional Gemini + Tavily layer that advises each order from market news.",
    poster: "/media/projects/claudecode/poster.jpg",
    gallery: [],
    links: [
      { label: "GitHub", href: "https://github.com/dereky925/ClaudeCoin" },
    ],
    stack: ["Python", "Alpaca", "Gemini", "Tavily", "Telegram"],
    problem:
      "A live strategy needs the same signals as its backtest, market-hours discipline, and a way to override mechanical entries when news disagrees—without placing duplicate orders on restart.",
    approach:
      "Daily SMA crossover (fast 10 / slow 30) is the primary signal. A cycle every 15 minutes fetches bars, computes buy/sell/hold, and optionally asks Gemini with Tavily news to confirm, reduce, skip, or override. Telegram handles alerts and remote start/stop. Same-bar dedup lives in local state.",
    outcome:
      "Paper and live paths share one strategy module. Backtests, parameter sweeps, and a Telegram command listener sit beside the bot so the system can be inspected without logging into a broker UI.",
  },
  {
    slug: "to-mars-and-beyond",
    title: "To Mars and Beyond",
    year: "2025",
    role: "Game",
    summary:
      "An 8-bit Starship run from Starbase to Voyager 1—dodge asteroids and UFOs, grab coins, hit planetary milestones.",
    poster: "/media/projects/mars/poster.jpg",
    gallery: [
      "/media/projects/mars/gallery-1.jpg",
      "/media/projects/mars/gallery-2.jpg",
    ],
    video: {
      streamId: streamClips.mars,
      caption: "Gameplay from Starbase out toward Voyager 1",
    },
    links: [
      {
        label: "Play",
        href: "https://dereky925.github.io/ToMarsAndBeyond/",
      },
      {
        label: "GitHub",
        href: "https://github.com/dereky925/ToMarsAndBeyond",
      },
    ],
    stack: ["JavaScript", "HTML5 Canvas", "GitHub Pages"],
    problem:
      "A space game has to feel fast on a phone with no framework tax, and still read as a solar-system journey instead of an endless runner with a skin.",
    approach:
      "One Canvas scene, mouse or swipe steering, and distance mapped onto real milestones—Moon through Voyager 1—with medals for how far the run gets. Dogecoins, shields, and hit-point rules keep the run readable in a few seconds.",
    outcome:
      "Playable in the browser on desktop and mobile. Independent fan project; not affiliated with SpaceX.",
  },
  {
    slug: "flappy-fury",
    title: "Flappy Fury",
    year: "2025",
    role: "Game",
    summary:
      "A Flappy Bird-inspired canvas game with an Anduril Fury, day/night cycle, and synthesized 8-bit audio—no asset files.",
    poster: "/media/projects/flappy-fury/poster.jpg",
    gallery: [],
    links: [
      { label: "Play", href: "https://dereky925.github.io/FlappyFury/" },
      { label: "GitHub", href: "https://github.com/dereky925/FlappyFury" },
    ],
    stack: ["JavaScript", "HTML5 Canvas", "Web Audio API"],
    problem:
      "A one-file game still needs atmosphere: lighting, traffic, sound, and scoring that works on a phone without a sprite pipeline.",
    approach:
      "Pure Canvas and vanilla JS. Obstacles borrow Mario brick and pipe language; the sky moves from day to night with stars and shooting stars; background Fury traffic and a cityscape sit on parallax layers. Sounds are synthesized with the Web Audio API.",
    outcome:
      "Playable instantly in a browser, 60fps with requestAnimationFrame, medals from bronze through platinum, high score in localStorage.",
  },
  {
    slug: "talentgrok",
    title: "TalentGrok",
    year: "2025",
    role: "xAI Hackathon",
    summary:
      "Grok recruiting agent that sources, screens, and learns from replies.",
    poster: "/media/projects/talentgrok/poster.jpg",
    gallery: [],
    video: {
      youtubeId: "r3_mI0W5Xk4",
      streamId: streamClips.talentgrok,
      caption: "Walkthrough from the xAI Hackathon",
    },
    links: [
      { label: "GitHub", href: "https://github.com/eus-lwq/TalentGrok" },
      { label: "YouTube", href: talentGrokYouTube },
    ],
    stack: [
      "Next.js",
      "Python",
      "Grok",
      "FAISS",
      "Supabase",
      "Three.js",
    ],
    problem:
      "Recruiting still leans on keyword search and cold LinkedIn blasts, which miss the people actually shipping research and treat every outreach the same.",
    approach:
      "Source from ArXiv into GitHub, rank with Grok plus FAISS instead of keywords, and close the loop with a bandit on hire/unhire. Outreach and calendar booking sit on Grok with Gmail and Google Calendar.",
    outcome:
      "Built at the xAI Hackathon with Mukta Jaiswal and Tyler Li. Live demo of the pipeline UI, sourcing, screening, and scheduled outreach.",
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getProjectSlugs() {
  return projects.map((project) => project.slug);
}

export type ProjectListing = {
  title: string;
  year: string;
  role: string;
  summary: string;
  poster?: string;
  streamId?: string;
  href?: string;
  external?: boolean;
};

export const projectListings: ProjectListing[] = [
  {
    title: "GrokEye",
    year: "2026",
    role: "xAI Hackathon",
    summary: "Hands-free Grok AR. Top 5 of 200+.",
    poster: "/media/projects/grokeye/poster.jpg",
    streamId: streamClips.grokeye,
    href: "/projects/grokeye",
  },
  {
    title: "Claude Coin",
    year: "2026",
    role: "Trading",
    summary: "Momentum bot on Alpaca with a Gemini news check on each order.",
    poster: "/media/projects/claudecode/poster.jpg",
    href: "/projects/claudecode",
  },
  {
    title: "Hunter Drone",
    year: "2022",
    role: "UB Drone Lab",
    summary: "Net-shooting quadcopter built to catch other drones.",
    poster: streamPoster(streamClips.hunter),
    streamId: streamClips.hunter,
    href: hunterYouTube,
    external: true,
  },
  {
    title: "To Mars and Beyond",
    year: "2025",
    role: "Game",
    summary: "An 8-bit Starship run from Starbase to Voyager 1.",
    poster: "/media/projects/mars/poster.jpg",
    streamId: streamClips.mars,
    href: "/projects/to-mars-and-beyond",
  },
  {
    title: "Flappy Fury",
    year: "2025",
    role: "Game",
    summary: "A one-file Fury Flappy Bird with synthesized audio.",
    poster: "/media/projects/flappy-fury/poster.jpg",
    streamId: streamClips.flappyfury,
    href: "/projects/flappy-fury",
  },
  {
    title: "TalentGrok",
    year: "2025",
    role: "xAI Hackathon",
    summary: "Grok recruiting agent that sources, screens, and learns from replies.",
    poster: "/media/projects/talentgrok/poster.jpg",
    streamId: streamClips.talentgrok,
    href: "/projects/talentgrok",
  },
  {
    title: "NG Space Sweep",
    year: "2023",
    role: "Northrop hackathon",
    summary:
      "Solo radar-satellite pitch for debris under 1 cm². Top 3 of 16 teams.",
  },
  {
    title: "Design, Build, Race",
    year: "2018",
    role: "UB boat race",
    summary: "Placed 1st of 300+ engineering students.",
    poster: "/media/projects/dbr/poster.jpg",
    streamId: streamClips.boat,
  },
];
