'use client';

import { useState } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Calendar,
  CheckCircle2,
  Clock,
  Dumbbell,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  Star,
  Video,
} from 'lucide-react';
import { Photo } from '@/components/site/Photo';
import { ProgramCard } from '@/components/site/ProgramCard';
import { Rating, Stars } from '@/components/site/Rating';
import { UserAvatar } from '@/components/site/UserAvatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { formatPrice } from '@/lib/format';
import type { Profile, Program, Review, Slot } from '@/lib/types';
import { toast } from 'sonner';

export function TrainerProfileClient({
  trainer,
  programs,
  slots,
  reviews,
  rating,
}: {
  trainer: Profile;
  programs: Program[];
  slots: Slot[];
  reviews: (Review & { client?: Profile })[];
  rating: { avg: number; count: number };
}) {
  const [activeTab, setActiveTab] = useState<'programs' | 'slots' | 'reviews'>('programs');
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  // Review modal state
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [allReviews, setAllReviews] = useState(reviews);

  const handleBookSlot = (slot: Slot) => {
    setSelectedSlot(slot);
    setBookingSuccess(false);
    setIsBookingOpen(true);
  };

  const handleConfirmBooking = () => {
    setBookingSuccess(true);
    toast.success('Session booked successfully! Added to your Library.');
  };

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    const newRev: Review & { client?: Profile } = {
      id: `rev-${Date.now()}`,
      trainerId: trainer.userId,
      clientId: 'c-alex',
      rating: reviewRating,
      comment: reviewComment || 'Incredible session! Learned a ton.',
      createdAt: new Date().toISOString(),
      client: {
        userId: 'c-alex',
        name: 'Alex Rivera',
        role: 'client',
        avatarUrl: null,
        coverUrl: null,
        headline: null,
        bio: null,
        specialties: null,
        sessionPriceCents: null,
      },
    };
    setAllReviews([newRev, ...allReviews]);
    setIsReviewOpen(false);
    setReviewComment('');
    toast.success('Thank you! Your verified review has been posted.');
  };

  return (
    <div className="container-page py-10 md:py-16">
      {/* Hero Profile Header */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-surface p-6 md:p-10">
        <div className="absolute right-0 top-0 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

        <div className="flex flex-col gap-8 md:flex-row md:items-start">
          {/* Avatar / Portrait */}
          <div className="relative aspect-square w-36 shrink-0 overflow-hidden rounded-2xl border border-border bg-surface-2 sm:w-44">
            <Photo
              src={trainer.coverUrl}
              alt={trainer.name}
              seed={trainer.userId}
              position="72% 20%"
              className="size-full"
            />
          </div>

          {/* Details */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="font-display text-4xl uppercase md:text-5xl">{trainer.name}</h1>
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-semibold text-lime-ink">
                <ShieldCheck className="size-3.5" /> Verified Coach
              </span>
            </div>

            <p className="mt-2 text-lg font-medium text-foreground">{trainer.headline}</p>

            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
              {trainer.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="size-4 text-lime-ink" /> {trainer.location}
                </span>
              )}
              {trainer.yearsCoaching && (
                <span className="flex items-center gap-1.5">
                  <Clock className="size-4 text-lime-ink" /> {trainer.yearsCoaching} yrs coaching
                </span>
              )}
              <Rating avg={rating.avg} count={allReviews.length} />
            </div>

            <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
              {trainer.bio}
            </p>

            {/* Specialties */}
            <div className="mt-5 flex flex-wrap gap-2">
              {trainer.specialties?.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-border bg-surface-2 px-3 py-1 text-xs font-medium text-foreground"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Action CTAs Box */}
          <div className="flex w-full flex-col justify-center rounded-2xl border border-border bg-surface-2/60 p-6 md:w-64">
            <div className="mb-4">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">1:1 Session Rate</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="font-display text-4xl text-foreground">
                  {formatPrice(trainer.sessionPriceCents ?? 0)}
                </span>
                <span className="text-xs text-muted-foreground">/ 60 min</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <Button
                onClick={() => setActiveTab('slots')}
                size="lg"
                className="w-full font-semibold"
              >
                <Calendar className="size-4" /> Book 1:1 Session
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full">
                <Link href="/messages">
                  <MessageSquare className="size-4" /> Message Coach
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="mt-12 flex border-b border-border">
        <button
          onClick={() => setActiveTab('programs')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
            activeTab === 'programs'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Dumbbell className="size-4" /> Programs ({programs.length})
        </button>
        <button
          onClick={() => setActiveTab('slots')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
            activeTab === 'slots'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Calendar className="size-4" /> Book Live 1:1 ({slots.filter((s) => s.status === 'open').length} open)
        </button>
        <button
          onClick={() => setActiveTab('reviews')}
          className={`flex items-center gap-2 border-b-2 px-6 py-3 text-sm font-semibold uppercase tracking-wider transition-colors ${
            activeTab === 'reviews'
              ? 'border-primary text-primary'
              : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          <Star className="size-4" /> Reviews ({allReviews.length})
        </button>
      </div>

      {/* Tab 1: Programs */}
      {activeTab === 'programs' && (
        <div className="py-8">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-display text-2xl uppercase">Workout Programs</h2>
            <p className="text-xs text-muted-foreground">Instant access to ordered video lessons</p>
          </div>
          {programs.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {programs.map((p) => (
                <ProgramCard key={p.id} program={p} showTrainer={false} />
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No programs published yet.</p>
          )}
        </div>
      )}

      {/* Tab 2: 1:1 Booking Slots */}
      {activeTab === 'slots' && (
        <div className="py-8">
          <div className="mb-6 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-2xl uppercase">Available 1:1 Live Sessions</h2>
              <p className="text-xs text-muted-foreground">
                60-minute private video call over Stream. Pick an open slot to hold and book.
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
              <Clock className="size-3.5 text-lime-ink" /> Shown in your local time zone
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {slots.map((slot) => {
              const date = new Date(slot.startsAt);
              const formattedDate = date.toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              });
              const formattedTime = date.toLocaleTimeString(undefined, {
                hour: 'numeric',
                minute: '2-digit',
              });

              const isOpen = slot.status === 'open';
              const isHeld = slot.status === 'held';
              const isBooked = slot.status === 'booked';

              return (
                <div
                  key={slot.id}
                  className={`flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                    isOpen
                      ? 'border-border bg-surface hover:border-primary/60'
                      : 'border-border/40 bg-surface/30 opacity-60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        {formattedDate}
                      </span>
                      {isOpen && (
                        <span className="size-2 rounded-full bg-primary shadow-[0_0_8px_#c6ff3d]" />
                      )}
                    </div>
                    <p className="font-display mt-2 text-3xl text-foreground">{formattedTime}</p>
                    <p className="mt-1 text-xs text-muted-foreground">60 min 1:1 Video Call</p>
                  </div>

                  <div className="mt-5 border-t border-border pt-4">
                    {isOpen ? (
                      <Button
                        onClick={() => handleBookSlot(slot)}
                        size="sm"
                        className="w-full font-semibold"
                      >
                        Book {formatPrice(trainer.sessionPriceCents ?? 0)}
                      </Button>
                    ) : isHeld ? (
                      <span className="block text-center text-xs font-medium text-amber-500">
                        In checkout (Held)
                      </span>
                    ) : (
                      <span className="block text-center text-xs font-medium text-muted-foreground">
                        Booked
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Reviews */}
      {activeTab === 'reviews' && (
        <div className="py-8">
          <div className="mb-8 flex flex-col justify-between gap-4 rounded-2xl border border-border bg-surface p-6 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-3">
                <span className="font-display text-5xl text-foreground">
                  {rating.avg ? rating.avg.toFixed(1) : '5.0'}
                </span>
                <div>
                  <Stars value={Math.round(rating.avg || 5)} />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Based on {allReviews.length} verified client reviews
                  </p>
                </div>
              </div>
            </div>

            <Button onClick={() => setIsReviewOpen(true)} className="font-semibold">
              <Star className="size-4" /> Leave a Review
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {allReviews.map((rev) => (
              <div
                key={rev.id}
                className="flex flex-col rounded-2xl border border-border bg-surface p-6"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <UserAvatar name={rev.client?.name || 'Client'} />
                    <div>
                      <p className="text-sm font-semibold">{rev.client?.name || 'Verified Client'}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Stars value={rev.rating} />
                </div>
                {rev.comment && (
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">&ldquo;{rev.comment}&rdquo;</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Slot Booking Modal */}
      <Dialog open={isBookingOpen} onOpenChange={setIsBookingOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl uppercase">
              {bookingSuccess ? 'Booking Confirmed!' : 'Confirm 1:1 Live Session'}
            </DialogTitle>
            <DialogDescription>
              {bookingSuccess
                ? 'Your private coaching slot has been locked in.'
                : 'Review your session details before checkout.'}
            </DialogDescription>
          </DialogHeader>

          {bookingSuccess ? (
            <div className="py-6 text-center">
              <div className="mx-auto grid size-16 place-items-center rounded-full bg-primary/20 text-lime-ink">
                <CheckCircle2 className="size-10" />
              </div>
              <h3 className="font-display mt-4 text-3xl uppercase">You&apos;re All Set!</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Your live video session with <strong>{trainer.name}</strong> is scheduled for{' '}
                {selectedSlot && new Date(selectedSlot.startsAt).toLocaleString()}.
              </p>
              <div className="mt-6 flex flex-col gap-2">
                <Button asChild size="lg" className="w-full font-semibold">
                  <Link href="/library">View In My Library</Link>
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsBookingOpen(false)}
                  className="w-full"
                >
                  Close
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="rounded-xl border border-border bg-surface-2 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Coach:</span>
                  <span className="font-semibold text-foreground">{trainer.name}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Date & Time:</span>
                  <span className="font-semibold text-foreground">
                    {selectedSlot && new Date(selectedSlot.startsAt).toLocaleString()}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="font-semibold text-foreground">60 Minutes</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Platform:</span>
                  <span className="font-semibold text-foreground">Stream 1:1 HD Video</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-base">
                  <span className="font-medium text-foreground">Total:</span>
                  <span className="font-display text-2xl text-lime-ink">
                    {formatPrice(trainer.sessionPriceCents ?? 0)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                * Simulated Stripe payment checkout. No real card charge will be made in demo mode.
              </p>

              <DialogFooter className="mt-6 flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsBookingOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  onClick={handleConfirmBooking}
                  className="flex-1 font-semibold"
                >
                  Pay & Confirm
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Review Submission Modal */}
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl uppercase">
              Review {trainer.name}
            </DialogTitle>
            <DialogDescription>
              Share your training experience to help other athletes.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddReview} className="space-y-4 py-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Rating
              </label>
              <div className="mt-2 flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`size-7 ${
                        star <= reviewRating
                          ? 'fill-primary text-primary'
                          : 'fill-transparent text-muted-foreground/40'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Your Feedback
              </label>
              <textarea
                required
                rows={4}
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="What did you work on? How did the coaching help your progression?"
                className="mt-2 w-full rounded-xl border border-border bg-surface p-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <DialogFooter className="mt-4 flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsReviewOpen(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1 font-semibold">
                Submit Review
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

