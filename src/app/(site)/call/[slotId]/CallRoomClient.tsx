'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Camera,
  CameraOff,
  Maximize2,
  Mic,
  MicOff,
  PhoneOff,
  ScreenShare,
  Settings,
  ShieldCheck,
  User,
  Users,
  Volume2,
} from 'lucide-react';
import { Photo } from '@/components/site/Photo';
import { UserAvatar } from '@/components/site/UserAvatar';
import { Button } from '@/components/ui/button';
import type { Profile, Slot } from '@/lib/types';
import { toast } from 'sonner';

export function CallRoomClient({
  slot,
  trainer,
}: {
  slot: Slot;
  trainer: Profile;
}) {
  const router = useRouter();
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [seconds, setSeconds] = useState(1458); // 24m 18s initial

  useEffect(() => {
    const timer = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (totalSeconds: number) => {
    const m = Math.floor(totalSeconds / 60);
    const s = totalSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleLeave = () => {
    toast.info('Left 1:1 Coaching Room.');
    router.push('/library');
  };

  return (
    <div className="relative flex h-[calc(100vh-4rem)] w-full flex-col overflow-hidden bg-[#070908] text-white">
      {/* Top Header Bar */}
      <div className="z-10 flex items-center justify-between border-b border-white/10 bg-black/40 px-6 py-3.5 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="size-2.5 animate-pulse rounded-full bg-primary shadow-[0_0_8px_#c6ff3d]" />
          <div>
            <h1 className="text-sm font-semibold text-white">
              1:1 Live Coaching · {trainer.name}
            </h1>
            <p className="text-xs text-white/60">Slot #{slot.id} · Stream Video Room</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-xs font-medium text-lime-ink">
            {formatTimer(seconds)}
          </span>
          <span className="hidden items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs text-emerald-400 sm:inline-flex">
            <ShieldCheck className="size-3.5" /> E2E Encrypted
          </span>
        </div>
      </div>

      {/* Main Video Arena */}
      <div className="relative flex flex-1 items-center justify-center p-4">
        {/* Trainer Main Video Frame */}
        <div className="relative aspect-[16/10] w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#111512] shadow-2xl">
          <Photo
            src={trainer.coverUrl || '/images/hero.png'}
            alt={trainer.name}
            seed={trainer.userId}
            position="72% 25%"
            className="size-full object-cover filter brightness-95"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

          {/* Trainer Label Tag */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-xl bg-black/60 px-3 py-1.5 backdrop-blur-md">
            <UserAvatar name={trainer.name} className="size-6" />
            <span className="text-xs font-semibold text-white">{trainer.name} (Coach)</span>
            <span className="flex gap-0.5">
              <span className="size-1 rounded-full bg-primary animate-bounce" />
              <span className="size-1 rounded-full bg-primary animate-bounce [animation-delay:0.2s]" />
              <span className="size-1 rounded-full bg-primary animate-bounce [animation-delay:0.4s]" />
            </span>
          </div>

          {/* Client Floating PIP (Picture-in-Picture) */}
          <div className="absolute bottom-4 right-4 aspect-[4/3] w-48 overflow-hidden rounded-2xl border-2 border-white/20 bg-[#171c18] shadow-2xl sm:w-56">
            {cameraOn ? (
              <div className="relative size-full bg-stone-900">
                <div className="absolute inset-0 flex flex-col items-center justify-center text-xs text-white/70">
                  <User className="size-10 text-white/40 mb-1" />
                  <span>Alex Rivera (You)</span>
                </div>
              </div>
            ) : (
              <div className="grid size-full place-items-center bg-[#0d110e] text-xs text-white/50">
                <CameraOff className="size-6 mb-1 text-white/30" />
                <span>Camera Off</span>
              </div>
            )}
            <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white">
              {!micOn && <MicOff className="size-3 text-red-400" />}
              <span>You</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Call Controls Dock */}
      <div className="z-10 flex items-center justify-center gap-3 border-t border-white/10 bg-black/60 py-4 backdrop-blur-md">
        <button
          onClick={() => setMicOn(!micOn)}
          className={`grid size-12 place-items-center rounded-2xl transition-all ${
            micOn
              ? 'bg-white/10 text-white hover:bg-white/20'
              : 'bg-red-500/20 text-red-400 border border-red-500/40'
          }`}
          title={micOn ? 'Mute Mic' : 'Unmute Mic'}
        >
          {micOn ? <Mic className="size-5" /> : <MicOff className="size-5" />}
        </button>

        <button
          onClick={() => setCameraOn(!cameraOn)}
          className={`grid size-12 place-items-center rounded-2xl transition-all ${
            cameraOn
              ? 'bg-white/10 text-white hover:bg-white/20'
              : 'bg-red-500/20 text-red-400 border border-red-500/40'
          }`}
          title={cameraOn ? 'Turn Camera Off' : 'Turn Camera On'}
        >
          {cameraOn ? <Camera className="size-5" /> : <CameraOff className="size-5" />}
        </button>

        <button
          onClick={() => {
            setIsScreenSharing(!isScreenSharing);
            toast.info(isScreenSharing ? 'Stopped screen share' : 'Started screen share');
          }}
          className={`hidden sm:grid size-12 place-items-center rounded-2xl transition-all ${
            isScreenSharing
              ? 'bg-primary text-primary-foreground font-semibold'
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
          title="Share Screen"
        >
          <ScreenShare className="size-5" />
        </button>

        <button
          onClick={handleLeave}
          className="flex h-12 items-center gap-2 rounded-2xl bg-destructive px-6 font-semibold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          <PhoneOff className="size-5" />
          <span>Leave Session</span>
        </button>
      </div>
    </div>
  );
}

