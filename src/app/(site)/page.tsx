import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Dumbbell, MessageSquare, PlayCircle, Quote, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProgramCard } from '@/components/site/ProgramCard';
import { SectionHeading } from '@/components/site/SectionHeading';
import { SpecialtyIcon } from '@/components/site/SpecialtyIcon';
import { Stars } from '@/components/site/Rating';
import { TrainerCard } from '@/components/site/TrainerCard';
import { UserAvatar } from '@/components/site/UserAvatar';
import { NewsletterForm } from '@/components/site/NewsletterForm';
import { SPECIALTIES, reviews } from '@/lib/mock-data';
import { allPublishedPrograms, featuredTrainers, getProfile, getTrainer } from '@/lib/queries';

const PILLARS = [
  { icon: Video, title: 'Train', text: 'Live 1:1 video sessions' },
  { icon: PlayCircle, title: 'Learn', text: 'Step-by-step programs' },
  { icon: MessageSquare, title: 'Talk', text: 'Chat with your coach' },
];

const STATS = [
  ['120+', 'Vetted coaches'],
  ['2.4K', 'Sessions booked'],
  ['4.9', 'Average rating'],
];

export default function LandingPage() {
  const trainers = featuredTrainers();
  const programs = allPublishedPrograms().slice(0, 4);
  const testimonials = reviews.filter((r) => r.comment && r.rating === 5).slice(0, 3);

  return (
    <>
      {/* HERO — always dark, it sits on photography */}
      <section className="dark relative isolate overflow-hidden bg-background text-foreground">
        <Image
          src="/images/hero.png"
          alt="Athlete curling a dumbbell in a dark gym"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover object-[68%_center] opacity-90 md:object-right"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/85 to-background/0 md:via-background/60" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-background to-transparent" />

        <div className="container-page relative grid min-h-[calc(100svh-4rem)] items-center gap-10 py-16 md:grid-cols-[1.25fr_1fr] md:py-24">
          <div className="max-w-2xl">
            <p className="eyebrow mb-6">Stronger every session</p>
            <h1 className="font-display text-[clamp(56px,9vw,120px)]">
              Train with
              <br />
              coaches who
              <br />
              <span className="text-lime-ink">get results</span>
            </h1>
            <p className="mt-6 max-w-md text-base text-muted-foreground md:text-lg">
              Find a personal trainer, follow their video programs and book live 1:1 sessions — all in one place.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/trainers">Find your trainer <ArrowRight data-icon="inline-end" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 bg-black/30 backdrop-blur">
                <Link href="/programs/p-strong-base"><PlayCircle data-icon="inline-start" /> Watch a free lesson</Link>
              </Button>
            </div>

            <dl className="mt-12 flex flex-wrap gap-x-10 gap-y-6">
              {STATS.map(([value, label], i) => (
                <div key={label} className={i > 0 ? 'border-l border-white/15 pl-10' : ''}>
                  <dt className="sr-only">{label}</dt>
                  <dd className="font-display text-5xl">{value}</dd>
                  <dd className="mt-1 text-xs text-muted-foreground">{label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative hidden h-full md:block">
            <p className="font-script absolute right-0 top-4 rotate-[-8deg] text-right text-5xl text-lime-ink lg:text-6xl">
              Better.
              <br />
              Stronger.
              <br />
              Every rep.
            </p>
            <ul className="absolute bottom-6 right-0 space-y-5">
              {PILLARS.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex items-center gap-3">
                  <Icon className="size-5 text-lime-ink" aria-hidden />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest">{title}</p>
                    <p className="text-xs text-muted-foreground">{text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* FEATURED TRAINERS */}
      <section className="border-t border-border py-20 md:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Featured coaches"
            title="Meet your next coach"
            description="Hand-picked trainers with proven programs and open slots this week."
            href="/trainers"
            linkLabel="View all trainers"
          />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {trainers.map((t, i) => (
              <TrainerCard key={t.userId} trainer={t} priority={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* SPECIALTIES */}
      <section className="relative overflow-hidden border-t border-border bg-surface/40 py-20">
        <p aria-hidden className="font-display pointer-events-none absolute -right-6 top-1/2 hidden -translate-y-1/2 text-right text-[120px] leading-[0.85] text-foreground/[0.04] lg:block">
          Discipline
          <br />
          builds
          <br />
          freedom
        </p>
        <div className="container-page relative">
          <SectionHeading eyebrow="Specialties" title="A coach for every goal" description="From heavy barbells to deep stretches — find what moves you." />
          <ul className="flex gap-4 overflow-x-auto pb-2 md:flex-wrap md:gap-6">
            {SPECIALTIES.map((s) => (
              <li key={s}>
                <Link href={`/trainers?specialty=${s.toLowerCase()}`} className="group flex w-20 flex-col items-center gap-3 md:w-24">
                  <span className="grid size-16 place-items-center rounded-full border border-border bg-surface text-lime-ink transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground md:size-20">
                    <SpecialtyIcon specialty={s} className="size-6 md:size-7" />
                  </span>
                  <span className="text-sm font-medium">{s}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="border-t border-border py-20 md:py-24">
        <div className="container-page">
          <SectionHeading
            eyebrow="Programs"
            title="Programs built by pros"
            description="Ordered video lessons you can follow at your own pace. The first lesson is always free."
          />
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {programs.map((p) => (
              <ProgramCard key={p.id} program={p} />
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS — session mock + steps */}
      <section className="relative overflow-hidden border-t border-border py-20 md:py-28">
        <div className="container-page grid items-center gap-14 lg:grid-cols-2">
          <SessionMock />
          <div>
            <p className="eyebrow mb-4">How it works</p>
            <h2 className="font-display text-5xl md:text-6xl">
              Your personal trainer.
              <br />
              <span className="text-lime-ink">On your screen.</span>
            </h2>
            <ol className="mt-10 space-y-7">
              {[
                ['Find your coach', 'Filter by specialty, read reviews and watch a free lesson before you commit.'],
                ['Buy a program or book a slot', 'Pay once with Stripe. Programs unlock instantly; sessions are 60 minutes.'],
                ['Train live & stay in touch', 'Join the video call from your library and message your coach any time.'],
              ].map(([title, text], i) => (
                <li key={title} className="flex gap-5">
                  <span className="font-display grid size-12 shrink-0 place-items-center rounded-xl border border-border text-2xl text-lime-ink">
                    0{i + 1}
                  </span>
                  <div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <p className="font-script pointer-events-none absolute bottom-10 right-8 hidden rotate-[-10deg] text-5xl text-lime-ink/80 xl:block">
          Small steps,
          <br />
          big changes
        </p>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-t border-border bg-surface/40 py-20 md:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Reviews" title="Real people. Real results." href="/trainers" linkLabel="Browse coaches" />
          <div className="grid gap-5 md:grid-cols-3">
            {testimonials.map((r, i) => {
              const client = getProfile(r.clientId)!;
              const trainer = getTrainer(r.trainerId)!;
              const achievement = i === 0 ? 'Deadlift +40 lbs' : i === 1 ? '5K time -2:15 min' : 'Shoulder mobility 100%';
              return (
                <figure key={r.id} className="flex flex-col rounded-2xl border border-border bg-surface p-6 transition-all hover:border-lime-ink/30">
                  <div className="flex items-center justify-between">
                    <Quote className="size-6 text-lime-ink" aria-hidden />
                    <span className="rounded-full border border-lime-ink/20 bg-lime-ink/10 px-2.5 py-0.5 text-[11px] font-semibold text-lime-ink">
                      {achievement}
                    </span>
                  </div>
                  <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed">&ldquo;{r.comment}&rdquo;</blockquote>
                  <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
                    <UserAvatar name={client.name} />
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{client.name}</p>
                      <p className="text-xs text-muted-foreground">Trains with {trainer.name}</p>
                    </div>
                    <Stars value={r.rating} />
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMMUNITY NEWSLETTER — inspired by design-ref.png */}
      <section className="py-12">
        <div className="container-page">
          <div className="relative isolate overflow-hidden rounded-3xl border border-border bg-surface-2 p-8 md:p-12">
            <div className="absolute -right-20 -top-20 -z-10 size-80 rounded-full bg-primary/10 blur-3xl" />
            <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
              <div className="max-w-xl">
                <span className="eyebrow">Repwise Community</span>
                <h2 className="font-display mt-2 text-4xl uppercase md:text-5xl">Join the Movement</h2>
                <p className="mt-3 text-sm text-muted-foreground md:text-base">
                  Get high-impact programming tips, exclusive trainer workout breakdowns, and early access to slot openings directly in your inbox.
                </p>
              </div>
              <div className="w-full max-w-md">
                <NewsletterForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRAINER CTA */}
      <section className="py-16">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl border border-border bg-surface">
            <div className="grid items-center gap-8 md:grid-cols-[280px_1fr_auto]">
              <div className="dark relative hidden h-full min-h-48 md:block">
                <Image src="/images/hero.png" alt="" fill sizes="280px" className="object-cover object-[72%_25%]" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-surface" />
              </div>
              <div className="p-8 md:p-0">
                <p className="eyebrow mb-3">For trainers</p>
                <h2 className="font-display text-4xl md:text-5xl">Coach on Repwise</h2>
                <p className="mt-2 max-w-md text-muted-foreground">
                  Sell programs, fill your calendar with paid 1:1 sessions and see every sale land live on your dashboard.
                </p>
              </div>
              <div className="px-8 pb-8 md:pb-0 md:pr-10 md:pl-0">
                <Button asChild size="lg">
                  <Link href="/onboarding"><Dumbbell data-icon="inline-start" /> Start coaching</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

/** Static illustration of a live session, built in HTML (no image needed). */
function SessionMock() {
  return (
    <div className="relative mx-auto w-full max-w-lg">
      <div className="absolute -inset-10 -z-10 rounded-full bg-[#c6ff3d]/10 blur-3xl" />
      <div className="dark overflow-hidden rounded-3xl border border-border bg-[#0d110e] p-3 text-foreground shadow-2xl">
        <div className="flex items-center justify-between px-2 pb-3 pt-1 text-xs">
          <span className="inline-flex items-center gap-2 font-medium">
            <span className="size-2 animate-pulse rounded-full bg-primary" /> Live · 1:1 with Maya
          </span>
          <span className="text-muted-foreground">24:18</span>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image src="/images/hero.png" alt="Trainer on a video call" fill sizes="512px" className="object-cover object-[72%_30%]" />
          <div className="absolute bottom-3 left-3 rounded-lg bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">Maya Torres</div>
          <div className="absolute bottom-3 right-3 grid aspect-[3/4] w-24 place-items-center rounded-xl border border-white/10 bg-[#171c18] text-xs text-white/70">
            <UserAvatar name="Alex Rivera" className="size-12" />
          </div>
        </div>
        <div className="flex items-center justify-center gap-3 pt-3">
          {['Mic', 'Cam', 'Chat'].map((l) => (
            <span key={l} className="grid size-10 place-items-center rounded-full bg-[#1b211d] text-[10px] font-semibold text-white/70">{l}</span>
          ))}
          <span className="grid h-10 place-items-center rounded-full bg-destructive px-4 text-xs font-semibold text-white">Leave</span>
        </div>
      </div>
      <div className="absolute -bottom-6 -left-4 hidden rounded-2xl border border-border bg-surface p-4 shadow-xl sm:block">
        <p className="text-xs text-muted-foreground">Next set</p>
        <p className="font-display text-3xl">Squat 3×5</p>
        <p className="text-xs text-lime-ink">+5 lb from last week</p>
      </div>
    </div>
  );
}

