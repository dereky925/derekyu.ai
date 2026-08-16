import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { FadeIn } from "@/components/fade-in";
import { SocialLinks } from "@/components/social-icons";
import { aboutHero, aboutStrip } from "@/lib/photos";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: {
    absolute: site.name,
  },
  description:
    "Derek Yu is a modeling and simulation engineer at Anduril, with drone photography, AR, and public software projects.",
  alternates: { canonical: "/" },
};

const now = [
  { label: "Now", value: "Modeling & simulation at Anduril" },
  { label: "Where", value: "Costa Mesa, California" },
  { label: "Before", value: "Northrop Grumman — GN&C, RF, sensors" },
  { label: "Air", value: "FAA Part 107 · Mavic 3 Pro, Avata" },
];

const doors = [
  {
    href: "/work",
    title: "Work",
    detail: "Anduril, Northrop, and the public projects.",
    image: {
      src: "/media/projects/grokeye/poster.jpg",
      alt: "GrokEye overlay on an espresso bar",
    },
  },
  {
    href: "/photography",
    title: "Photography",
    detail: "Aerial stills and clips from Arizona and California.",
    image: {
      src: aboutStrip[0]!.src,
      alt: "Drone photograph of a desert ridgeline by Derek Yu",
    },
  },
];

export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 pb-24 pt-20 sm:pt-28">
      <FadeIn>
        <p className="text-sm text-muted">Costa Mesa, CA</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight sm:text-6xl">
          {site.name}
        </h1>
        <p className="mt-6 max-w-2xl text-xl leading-snug tracking-tight text-muted sm:text-2xl">
          Modeling and simulation at Anduril. I fly the camera, I point at
          the part, and I care whether the loop actually closes.
        </p>
        <SocialLinks />
      </FadeIn>

      <FadeIn delay={0.06} className="mt-14 sm:mt-16">
        <Link
          href="/photography"
          className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-surface sm:aspect-[2.15/1]"
        >
          <Image
            src={aboutHero.src}
            alt="Aerial photograph of Horseshoe Bend by Derek Yu"
            fill
            sizes="(min-width: 1152px) 1104px, 100vw"
            fetchPriority="high"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
          />
        </Link>
      </FadeIn>

      <FadeIn delay={0.1}>
        <dl className="mt-16 grid gap-8 border-y border-border py-10 sm:grid-cols-2 lg:grid-cols-4">
          {now.map((item) => (
            <div key={item.label}>
              <dt className="text-sm text-muted">{item.label}</dt>
              <dd className="mt-2 text-sm leading-relaxed">{item.value}</dd>
            </div>
          ))}
        </dl>
      </FadeIn>

      <FadeIn>
        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-20">
          <div className="space-y-5 text-lg leading-relaxed text-muted">
            <p>
              Days are modeling and simulation for Air Dominance &amp; Strike.
              The through-line from Northrop is the same: a nav filter that
              still tracks when GPS does not, a payload bench that has to stay
              up at 3&nbsp;a.m., a gimbal that has to point at the thing it
              claims to see.
            </p>
            <p>
              The public set is different and the same. GrokEye watches a
              bench through a camera and tells you where to put your hands.
              Claude Coin only trades in market hours. The stills are from a
              Mavic and two Avatas over Arizona and the California coast. If
              the loop is late or the frame shakes, it does not count.
            </p>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-muted lg:pt-1">
            Purdue M.S. in astrodynamics. Buffalo for the undergraduate years,
            the drone-hunter, and the Moog summers. This site is what I can
            show — not the classified work.
          </p>
        </div>
      </FadeIn>

      <section className="mt-24 grid gap-10 md:grid-cols-2 md:gap-8">
        {doors.map((door, index) => (
          <FadeIn key={door.href} delay={Math.min(index * 0.06, 0.12)}>
            <Link href={door.href} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-surface">
                <Image
                  src={door.image.src}
                  alt={door.image.alt}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </div>
              <h2 className="mt-4 text-lg tracking-tight">{door.title}</h2>
              <p className="mt-1 text-sm text-muted">{door.detail}</p>
            </Link>
          </FadeIn>
        ))}
      </section>

      <section className="mt-24">
        <FadeIn>
          <div className="mb-6 flex items-end justify-between gap-6">
            <p className="text-sm text-muted">From the air</p>
            <Link
              href="/photography"
              className="text-sm text-muted transition-colors hover:text-foreground"
            >
              All photography
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {aboutStrip.map((photo) => (
              <Link
                key={photo.src}
                href="/photography"
                className="relative overflow-hidden rounded-xl bg-surface"
              >
                <Image
                  src={photo.src}
                  alt="Drone photograph by Derek Yu"
                  width={photo.width}
                  height={photo.height}
                  sizes="33vw"
                  className="h-28 w-full object-cover sm:h-44"
                />
              </Link>
            ))}
          </div>
        </FadeIn>
      </section>
    </main>
  );
}
