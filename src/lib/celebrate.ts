import { prefersReducedMotion } from './utils';

/**
 * Perayaan kecil saat tamu mengonfirmasi kehadiran.
 * Menggunakan palette emas–marun agar tetap sesuai art direction.
 *
 * `canvas-confetti` dimuat secara dinamis: pustaka ini hanya diunduh saat
 * tamu benar-benar mengirim konfirmasi, sehingga tidak membebani muat awal.
 */
type ConfettiFn = (options: Record<string, unknown>) => void;

let confettiPromise: Promise<ConfettiFn> | null = null;

function loadConfetti(): Promise<ConfettiFn> {
  if (!confettiPromise) {
    confettiPromise = import('canvas-confetti').then((mod) => mod.default as unknown as ConfettiFn);
  }
  return confettiPromise;
}

const COLORS = ['#C6A56B', '#F4E0B9', '#DFB76C', '#762D32', '#F7F0E4'];

export function triggerCelebration(): void {
  if (prefersReducedMotion()) return;

  void loadConfetti().then((confetti) => {
    // Ledakan pertama dari bawah-tengah.
    confetti({
      particleCount: 70,
      spread: 68,
      startVelocity: 42,
      origin: { x: 0.5, y: 0.95 },
      colors: COLORS,
      scalar: 0.9,
      disableForReducedMotion: true,
    });

    // Petasan kecil dari kedua sisi.
    window.setTimeout(() => {
      confetti({
        particleCount: 34,
        angle: 60,
        spread: 52,
        origin: { x: 0.05, y: 0.86 },
        colors: COLORS,
        scalar: 0.75,
        disableForReducedMotion: true,
      });
      confetti({
        particleCount: 34,
        angle: 120,
        spread: 52,
        origin: { x: 0.95, y: 0.86 },
        colors: COLORS,
        scalar: 0.75,
        disableForReducedMotion: true,
      });
    }, 180);
  });
}

/** Versi lebih kalem, dipakai saat undangan pertama kali dibuka. */
export function triggerSoftSparkle(): void {
  if (prefersReducedMotion()) return;
  void loadConfetti().then((confetti) => {
    confetti({
      particleCount: 26,
      spread: 90,
      startVelocity: 26,
      gravity: 0.5,
      ticks: 160,
      origin: { x: 0.5, y: 0.4 },
      colors: ['#C6A56B', '#F4E0B9', '#DFB76C'],
      scalar: 0.6,
      shapes: ['circle'],
      disableForReducedMotion: true,
    });
  });
}
