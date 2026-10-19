import { useEffect, useMemo, useState } from 'react';
import { clampNonNegative } from '../lib/utils';

export interface CountdownParts {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  /** true bila waktu target sudah terlewati */
  isPast: boolean;
  /** Selisih milidetik */
  diff: number;
}

/**
 * Hitung mundur real-time menuju `targetISO`.
 * - Menggunakan satu interval 1 detik (bukan requestAnimationFrame) agar hemat CPU.
 * - Interval otomatis berhenti saat tab tidak aktif? Tidak — kita biarkan agar
 *   angka tetap akurat, namun perhitungan ulang dilakukan saat tab kembali fokus.
 */
export function useCountdown(targetISO: string): CountdownParts {
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);
  const compute = (): CountdownParts => {
    const diff = target - Date.now();
    if (Number.isNaN(target)) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true, diff: 0 };
    }
    const total = Math.max(0, diff);
    return {
      days: Math.floor(total / 86_400_000),
      hours: Math.floor((total / 3_600_000) % 24),
      minutes: Math.floor((total / 60_000) % 60),
      seconds: Math.floor((total / 1000) % 60),
      isPast: diff <= 0,
      diff: clampNonNegative(diff),
    };
  };

  const [parts, setParts] = useState<CountdownParts>(compute);

  useEffect(() => {
    const tick = () => setParts(compute());
    tick();
    const id = window.setInterval(tick, 1000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') tick();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      window.clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return parts;
}
