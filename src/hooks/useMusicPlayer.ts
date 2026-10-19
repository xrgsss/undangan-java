import { useCallback, useEffect, useRef, useState } from 'react';
import { GamelanEngine } from '../lib/gamelan';
import type { MusicConfig } from '../types/invitation';

export interface MusicPlayerApi {
  isPlaying: boolean;
  volume: number;
  level: number;
  ready: boolean;
  /** true bila memakai file audio milik pengguna (bukan sintesis) */
  usingFile: boolean;
  title: string;
  artist: string;
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => Promise<void>;
  setVolume: (v: number) => void;
}

/**
 * Pemutar musik latar.
 * - Jika `config.src` diisi → memakai <audio> milik pengguna (file berlisensi).
 * - Jika tidak → memakai GamelanEngine (sintesis Web Audio, bebas royalti).
 * - Tidak pernah autoplay melanggar kebijakan: hanya mulai setelah gesture tamu.
 */
export function useMusicPlayer(config: MusicConfig): MusicPlayerApi {
  const engineRef = useRef<GamelanEngine | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.5);
  const [level, setLevel] = useState(0);
  const [ready, setReady] = useState(false);

  const usingFile = Boolean(config.src);

  // Siapkan elemen audio bila memakai file pengguna.
  useEffect(() => {
    if (!config.enabled || !config.src) return;
    const el = new Audio();
    el.src = config.src;
    el.loop = true;
    el.preload = 'none';
    el.crossOrigin = 'anonymous';
    el.volume = volume;
    audioRef.current = el;
    return () => {
      el.pause();
      el.src = '';
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.enabled, config.src]);

  useEffect(() => {
    setReady(config.enabled);
  }, [config.enabled]);

  // Loop animasi untuk visualisasi level audio.
  useEffect(() => {
    if (!isPlaying) {
      setLevel(0);
      return;
    }
    let mounted = true;
    const tick = () => {
      if (!mounted) return;
      if (usingFile) {
        // Untuk file audio kita tidak punya analyser; pakai osilasi lembut
        // agar ikon tetap hidup tanpa mengklaim data palsu.
        setLevel(0.35 + Math.abs(Math.sin(Date.now() / 420)) * 0.35);
      } else if (engineRef.current) {
        setLevel(engineRef.current.getLevel());
      }
      rafRef.current = window.setTimeout(tick, 120);
    };
    tick();
    return () => {
      mounted = false;
      if (rafRef.current) window.clearTimeout(rafRef.current);
    };
  }, [isPlaying, usingFile]);

  const play = useCallback(async () => {
    if (!config.enabled) return;
    if (usingFile && audioRef.current) {
      try {
        audioRef.current.volume = volume;
        await audioRef.current.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }
    if (!engineRef.current) {
      engineRef.current = new GamelanEngine({ volume });
    }
    const ok = await engineRef.current.start();
    setIsPlaying(ok);
  }, [config.enabled, usingFile, volume]);

  const pause = useCallback(() => {
    if (usingFile) audioRef.current?.pause();
    engineRef.current?.pause();
    setIsPlaying(false);
  }, [usingFile]);

  const toggle = useCallback(async () => {
    if (isPlaying) pause();
    else await play();
  }, [isPlaying, pause, play]);

  const setVolume = useCallback(
    (v: number) => {
      const next = Math.min(1, Math.max(0, v));
      setVolumeState(next);
      engineRef.current?.setVolume(next);
      if (audioRef.current) audioRef.current.volume = next;
    },
    [],
  );

  useEffect(
    () => () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    },
    [],
  );

  return {
    isPlaying,
    volume,
    level,
    ready,
    usingFile,
    title: config.title,
    artist: config.artist,
    play,
    pause,
    toggle,
    setVolume,
  };
}
