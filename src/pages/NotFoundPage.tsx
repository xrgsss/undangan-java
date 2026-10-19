import { ArrowLeft, Compass } from 'lucide-react';
import { Gunungan } from '../components/ornaments/Gunungan';
import { OrnamentDefs } from '../components/ornaments/OrnamentDefs';
import { OrnateDivider, UkelFlourish } from '../components/ornaments/Ornaments';
import { WayangFigure } from '../components/ornaments/WayangFigure';
import { BatikBackdrop } from '../components/sections/decor';
import { GoldButton, GoldPill, Reveal } from '../components/ui/primitives';

/**
 * Halaman 404 bergaya keraton — bukan sekadar teks "not found".
 */
export function NotFoundPage({ navigate }: { navigate: (to: string) => void }) {
  return (
    <>
      <OrnamentDefs />

      <div className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        <BatikBackdrop opacity={0.07} motif="parang" />

        <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2">
          <div className="mx-auto flex max-w-4xl items-end justify-between">
            <WayangFigure variant="arjuna" className="h-40 w-auto opacity-25 sm:h-56" />
            <WayangFigure variant="srikandi" mirror className="h-40 w-auto opacity-25 sm:h-56" />
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <Reveal y={-10}>
            <GoldPill>
              <Compass size={11} /> Tersesat di Pendopo
            </GoldPill>
          </Reveal>

          <Reveal delay={0.08} className="mt-6">
            <Gunungan flames glow className="h-28 w-auto sm:h-36" />
          </Reveal>

          <Reveal delay={0.16} className="mt-6">
            <p className="font-cinzeldec text-[4.5rem] leading-none text-gold-gradient text-gold-glow sm:text-[6rem]">
              404
            </p>
          </Reveal>

          <Reveal delay={0.24} className="mt-2">
            <UkelFlourish className="h-8 w-44 opacity-80 sm:w-56" />
          </Reveal>

          <Reveal delay={0.3} className="mt-5 max-w-xl">
            <h1 className="font-cinzel text-lg text-jawa-ivory sm:text-2xl">
              Undangan yang Anda cari tidak ditemukan
            </h1>
            <p className="mt-3 font-serif text-[15px] leading-[1.9] text-jawa-beige/80">
              Mungkin tautannya salah ketik, sudah kedaluwarsa, atau belum dipublikasikan oleh
              pemilik undangan. Silakan periksa kembali tautan yang Anda terima dari keluarga
              mempelai.
            </p>
          </Reveal>

          <Reveal delay={0.4} className="mt-9">
            <OrnateDivider className="mb-7" />
            <div className="flex flex-wrap items-center justify-center gap-3">
              <GoldButton size="md" onClick={() => navigate('/')}>
                <ArrowLeft size={14} /> Kembali ke Beranda
              </GoldButton>
              <GoldButton
                size="md"
                variant="outline"
                onClick={() => navigate('/demo/jawa-royal')}
              >
                Lihat Contoh Undangan
              </GoldButton>
            </div>
          </Reveal>
        </div>
      </div>
    </>
  );
}
