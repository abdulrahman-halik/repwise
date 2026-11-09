'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Calendar,
  Camera,
  CameraOff,
  Clock,
  LogOut,
  MessageSquare,
  Mic,
  MicOff,
  PhoneCall,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
} from 'lucide-react';
import {
  type Call,
  CallControls,
  CallingState,
  SpeakerLayout,
  StreamCall,
  StreamTheme,
  StreamVideo,
  useCallStateHooks,
  VideoPreview,
} from '@stream-io/video-react-sdk';
import { StreamLoginCard } from '@/components/stream/StreamLoginCard';
import { Photo } from '@/components/site/Photo';
import { UserAvatar } from '@/components/site/UserAvatar';
import { Button } from '@/components/ui/button';
import { useStreamContext } from '@/context/StreamContext';
import type { Profile, Slot } from '@/lib/types';
import { toast } from 'sonner';

function ActiveCallStage({
  slot,
  trainer,
  onLeave,
}: {
  slot: Slot;
  trainer: Profile;
  onLeave: () => void;
}) {
  const {
    useCallCallingState,
    useParticipantCount,
    useCameraState,
    useMicrophoneState,
  } = useCallStateHooks();

  const callingState = useCallCallingState();
  const participantCount = useParticipantCount();
  const { isMute: isCameraOff } = useCameraState();
  const { isMute: isMicOff } = useMicrophoneState();

  return (
    <div className="flex h-full flex-col justify-between">
      {/* Live Session Status Subbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-black/50 px-6 py-2.5 text-xs">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-2.5 py-0.5 font-semibold text-lime-ink">
            <span className="size-2 animate-pulse rounded-full bg-primary" />
            {callingState === CallingState.JOINED ? 'Live 1:1 Session' : 'Connecting...'}
          </span>
          <span className="inline-flex items-center gap-1.5 text-white/75" data-testid="call-participant-count">
            <Users className="size-3.5 text-lime-ink" />
            {participantCount} {participantCount === 1 ? 'Participant' : 'Participants'} in Room
          </span>
        </div>

        <div className="flex items-center gap-3 text-white/70">
          <span data-testid="mic-state-badge" className="inline-flex items-center gap-1">
            {isMicOff ? (
              <>
                <MicOff className="size-3.5 text-red-400" /> Mic Muted
              </>
            ) : (
              <>
                <Mic className="size-3.5 text-lime-ink" /> Mic Active
              </>
            )}
          </span>
          <span data-testid="camera-state-badge" className="inline-flex items-center gap-1">
            {isCameraOff ? (
              <>
                <CameraOff className="size-3.5 text-red-400" /> Camera Off
              </>
            ) : (
              <>
                <Camera className="size-3.5 text-lime-ink" /> Camera Active
              </>
            )}
          </span>
          <span>Coach: {trainer.name} · Slot #{slot.id}</span>
        </div>
      </div>

      {/* Main Stream SpeakerLayout Arena */}
      <div className="relative flex-1 overflow-hidden p-4" data-testid="active-video-stage">
        <div className="mx-auto flex h-full max-w-6xl flex-col justify-center overflow-hidden rounded-3xl border border-white/10 bg-[#111512] p-3 shadow-2xl">
          <SpeakerLayout participantsBarPosition="right" />
        </div>
      </div>

      {/* Stream Video Call Controls Dock (Mic, Camera, ScreenShare, Reactions, Leave) */}
      <div
        className="z-10 flex items-center justify-center border-t border-white/10 bg-black/70 px-4 py-3 backdrop-blur-md"
        data-testid="stream-call-controls"
      >
        <CallControls onLeave={onLeave} />
      </div>
    </div>
  );
}

export function CallRoomClient({
  slot,
  trainer,
}: {
  slot: Slot;
  trainer: Profile;
}) {
  const router = useRouter();
  const { streamUser, videoClient, logoutStreamUser } = useStreamContext();

  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [inCall, setInCall] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [joinWithMic, setJoinWithMic] = useState(true);
  const [joinWithCamera, setJoinWithCamera] = useState(true);
  const [previewEnabled, setPreviewEnabled] = useState(false);

  const activeCallRef = useRef<Call | null>(null);

  // Per-screen cleanup: leave the call on unmount, NEVER disconnect videoClient
  useEffect(() => {
    return () => {
      if (activeCallRef.current) {
        activeCallRef.current.leave().catch(() => {});
        activeCallRef.current = null;
      }
    };
  }, []);

  const handleJoinSession = useCallback(async () => {
    if (!videoClient || !streamUser || isJoining) return;
    setIsJoining(true);

    try {
      const callId = `repwise-slot-${slot.id}`;
      const call = videoClient.call('default', callId);

      // Apply pre-join lobby preferences before joining; camera/mic permission is only requested here on explicit Join
      if (!joinWithCamera) {
        await call.camera.disable().catch(() => {});
      }
      if (!joinWithMic) {
        await call.microphone.disable().catch(() => {});
      }

      await call.join({
        create: true,
        data: {
          custom: {
            slotId: slot.id,
            trainerId: trainer.userId,
            trainerName: trainer.name,
          },
        },
      });

      if (joinWithCamera) {
        await call.camera.enable().catch(() => {
          // Gracefully continue if headless/device-free browser has no physical webcam
        });
      }
      if (joinWithMic) {
        await call.microphone.enable().catch(() => {
          // Gracefully continue if headless/device-free browser has no physical mic
        });
      }

      activeCallRef.current = call;
      setActiveCall(call);
      setInCall(true);
      toast.success(`Joined 1:1 session room #${slot.id}`);
    } catch (err: unknown) {
      console.error('Failed to join Stream Video call:', err);
      toast.error(err instanceof Error ? err.message : 'Unable to join video call');
    } finally {
      setIsJoining(false);
    }
  }, [videoClient, streamUser, isJoining, slot.id, trainer.userId, trainer.name, joinWithCamera, joinWithMic]);

  const handleEnableLobbyPreview = useCallback(async () => {
    if (!videoClient) return;
    try {
      const callId = `repwise-slot-${slot.id}`;
      const call = activeCall || videoClient.call('default', callId);
      await call.getOrCreate();
      await call.camera.enable().catch(() => {});
      activeCallRef.current = call;
      setActiveCall(call);
      setPreviewEnabled(true);
    } catch {
      toast.info('Camera preview unavailable on this device; you can still join the call.');
    }
  }, [videoClient, activeCall, slot.id]);

  const handleLeaveCall = useCallback(async () => {
    if (activeCallRef.current) {
      await activeCallRef.current.leave().catch(() => {});
      activeCallRef.current = null;
    }
    setActiveCall(null);
    setInCall(false);
    setPreviewEnabled(false);
    toast.info('Left 1:1 Coaching Room.');
  }, []);

  if (!streamUser || !videoClient) {
    return (
      <StreamLoginCard
        title={`1:1 Video Room · ${trainer.name}`}
        subtitle={`Sign in to access the coaching lobby for Slot #${slot.id}. Camera and microphone permissions are only requested when you explicitly join.`}
      />
    );
  }

  const slotDate = new Date(slot.startsAt);

  return (
    <div className="relative flex h-[calc(100vh-4rem)] w-full flex-col overflow-hidden bg-[#070908] text-white">
      {/* Top Header Bar */}
      <div className="z-10 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black/50 px-6 py-3.5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="size-2.5 animate-pulse rounded-full bg-primary shadow-[0_0_8px_#c6ff3d]" />
          <div>
            <h1 className="text-sm font-semibold text-white">
              1:1 Live Coaching · {trainer.name}
            </h1>
            <p className="text-xs text-white/60">
              Slot #{slot.id} · Stream Video SDK · Signed in as{' '}
              <span className="font-semibold text-lime-ink">{streamUser.name}</span> ({streamUser.id})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="hidden items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400 sm:inline-flex">
            <ShieldCheck className="size-3.5" /> WebRTC Encrypted
          </span>
          <Button asChild variant="outline" size="sm" className="border-white/15 bg-white/5 text-white hover:bg-white/10">
            <Link href={`/messages?partner=${trainer.userId}`}>
              <MessageSquare className="size-3.5" /> Chat with Coach
            </Link>
          </Button>
          {!inCall && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={logoutStreamUser}
              className="border-white/15 bg-white/5 text-white hover:bg-white/10"
            >
              <LogOut className="size-3.5" /> Switch User
            </Button>
          )}
        </div>
      </div>

      {/* StreamVideo Provider Shell */}
      <StreamVideo client={videoClient}>
        {inCall && activeCall ? (
          <StreamCall call={activeCall}>
            <StreamTheme className="flex flex-1 flex-col overflow-hidden">
              <ActiveCallStage
                slot={slot}
                trainer={trainer}
                onLeave={handleLeaveCall}
              />
            </StreamTheme>
          </StreamCall>
        ) : (
          /* Default Landing State: Pre-Call Lobby (No auto-join or camera prompt on page load) */
          <div
            className="flex flex-1 items-center justify-center overflow-y-auto p-4 md:p-8"
            data-testid="video-call-lobby"
          >
            <div className="grid w-full max-w-5xl grid-cols-1 overflow-hidden rounded-3xl border border-white/10 bg-[#111512] shadow-2xl lg:grid-cols-[1.15fr_0.85fr]">
              {/* Left: Camera / Stage Preview Box */}
              <div className="relative flex flex-col justify-between border-b border-white/10 bg-[#0b0e0c] p-6 lg:border-b-0 lg:border-r">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-lime-ink">
                    <Sparkles className="size-3" /> Green Room Lobby
                  </span>
                  <span className="text-xs text-white/50">Call ID: repwise-slot-{slot.id}</span>
                </div>

                <div className="relative my-5 aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-[#171c18]">
                  {previewEnabled && activeCall ? (
                    <StreamCall call={activeCall}>
                      <StreamTheme className="size-full">
                        <VideoPreview />
                      </StreamTheme>
                    </StreamCall>
                  ) : (
                    <>
                      <Photo
                        src={trainer.coverUrl === '/images/hero.png' ? null : trainer.coverUrl}
                        alt={trainer.name}
                        seed={trainer.userId}
                        position="72% 25%"
                        className="size-full object-cover opacity-35"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/55 p-6 text-center backdrop-blur-[2px]">
                        <UserAvatar name={streamUser.name} className="size-16 border-2 border-primary" />
                        <p className="mt-3 text-base font-semibold text-white">
                          Ready to check in, {streamUser.name}?
                        </p>
                        <p className="mt-1 max-w-xs text-xs text-white/65">
                          Camera and microphone permissions are only requested when you preview or click Join below.
                        </p>
                        <button
                          type="button"
                          onClick={handleEnableLobbyPreview}
                          className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
                        >
                          <Camera className="size-3.5 text-lime-ink" /> Test Camera Preview
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Pre-join Mic & Camera Toggles */}
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      data-testid="lobby-toggle-mic"
                      onClick={() => setJoinWithMic((v) => !v)}
                      className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                        joinWithMic
                          ? 'border-white/20 bg-white/10 text-white hover:bg-white/15'
                          : 'border-red-500/40 bg-red-500/20 text-red-300'
                      }`}
                    >
                      {joinWithMic ? <Mic className="size-4 text-lime-ink" /> : <MicOff className="size-4" />}
                      {joinWithMic ? 'Mic On' : 'Mic Muted'}
                    </button>

                    <button
                      type="button"
                      data-testid="lobby-toggle-camera"
                      onClick={() => setJoinWithCamera((v) => !v)}
                      className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-semibold transition ${
                        joinWithCamera
                          ? 'border-white/20 bg-white/10 text-white hover:bg-white/15'
                          : 'border-red-500/40 bg-red-500/20 text-red-300'
                      }`}
                    >
                      {joinWithCamera ? (
                        <Camera className="size-4 text-lime-ink" />
                      ) : (
                        <CameraOff className="size-4" />
                      )}
                      {joinWithCamera ? 'Camera On' : 'Camera Off'}
                    </button>
                  </div>

                  <span className="text-[11px] text-white/50">
                    You can toggle devices anytime during the call
                  </span>
                </div>
              </div>

              {/* Right: Session Brief & Join CTA */}
              <div className="flex flex-col justify-between p-6 sm:p-8">
                <div>
                  <span className="eyebrow">1:1 Coaching Session</span>
                  <h2 className="font-display mt-2 text-3xl uppercase text-white sm:text-4xl">
                    Session with {trainer.name}
                  </h2>
                  <p className="mt-1 text-xs text-white/65">{trainer.headline}</p>

                  <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-white/60">
                        <Calendar className="size-4 text-lime-ink" /> Date
                      </span>
                      <span className="font-semibold text-white">
                        {slotDate.toLocaleDateString(undefined, {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-white/60">
                        <Clock className="size-4 text-lime-ink" /> Time
                      </span>
                      <span className="font-semibold text-white">
                        {slotDate.toLocaleTimeString(undefined, {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}{' '}
                        (60 min)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-2 text-white/60">
                        <Video className="size-4 text-lime-ink" />Joining As
                      </span>
                      <span className="font-semibold text-lime-ink">
                        {streamUser.name} ({streamUser.role === 'trainer' ? 'Coach' : 'Athlete'})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Button
                    type="button"
                    size="lg"
                    disabled={isJoining}
                    onClick={handleJoinSession}
                    data-testid="join-video-call"
                    className="w-full font-semibold"
                  >
                    <PhoneCall className="size-4" />
                    {isJoining ? 'Joining Stream Video Room...' : 'Join 1:1 Session Now'}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    size="lg"
                    onClick={() => router.push('/library')}
                    className="w-full border-white/15 bg-transparent text-white hover:bg-white/10"
                  >
                    Back to My Library
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </StreamVideo>
    </div>
  );
}
