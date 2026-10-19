import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { GuestContext, InvitationConfig } from '../../types/invitation';
import { OrnamentDefs } from '../ornaments/OrnamentDefs';
import { CoverScreen } from '../cover/CoverScreen';
import { HeroSection, OpeningSection, QuoteSection, WayangTransition } from '../sections/HeroOpening';
import { CountdownSection, CoupleSection, EventsSection } from '../sections/CoupleEvents';
import { GallerySection, LoveStorySection } from '../sections/StoryGallery';
import { TraditionsSection, VenueSection } from '../sections/TraditionsVenue';
import { RsvpSection, WishesSection } from '../sections/RsvpWishes';
import { ClosingSection, GiftSection } from '../sections/GiftClosing';
import { NavDock } from '../layout/NavDock';
import { ShareBar } from '../layout/ShareBar';
import { MusicPlayer } from '../audio/MusicPlayer';
import { useMusicPlayer } from '../../hooks/useMusicPlayer';
import { triggerSoftSparkle } from '../../lib/celebrate';

export interface InvitationTemplateProps {
  config: InvitationConfig;
  guest: GuestContext;
  /** Tampilkan tombol berbagi (disembunyikan pada mode demo template) */
  shareable?: boolean;
}

/**
 * ============================================================================
 *  TEMPLATE UNDANGAN
 * ============================================================================
 *  Menerima konfigurasi (data) + konteks tamu (dari URL) dan menyusun
 *  seluruh section. Tidak ada nama, tanggal, maupun foto yang ditulis
 *  langsung di dalam komponen — semuanya berasal dari `config`.
 * ============================================================================
 */
export function InvitationTemplate({ config, guest, shareable = true }: InvitationTemplateProps) {
  const [started, setStarted] = useState(false);
  const [coverGone, setCoverGone] = useState(false);
  const music = useMusicPlayer(config.music);

  // Cover benar-benar dilepas setelah animasi tirai selesai.
  useEffect(() => {
    const handler = () => setCoverGone(true);
    document.addEventListener('cover:closed', handler);
    return () => document.removeEventListener('cover:closed', handler);
  }, []);

  // Kunci gulir selama cover masih tertutup.
  useEffect(() => {
    document.body.style.overflow = started ? '' : 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [started]);

  // Perbarui metadata dokumen dari konfigurasi.
  useEffect(() => {
    document.title = config.meta.title;
    document.documentElement.setAttribute('data-theme', config.template);
    const setMeta = (selector: string, attr: string, value: string) => {
      const el = document.head.querySelector(selector);
      if (el) el.setAttribute(attr, value);
    };
    setMeta('meta[name="description"]', 'content', config.meta.description);
    setMeta('meta[property="og:title"]', 'content', config.meta.title);
    setMeta('meta[property="og:description"]', 'content', config.meta.description);
    setMeta('meta[property="og:image"]', 'content', config.meta.ogImage);
    setMeta('meta[name="twitter:title"]', 'content', config.meta.title);
    setMeta('meta[name="twitter:description"]', 'content', config.meta.description);
    setMeta('meta[name="twitter:image"]', 'content', config.meta.ogImage);
  }, [config.meta, config.template]);

  const handleOpen = useCallback(
    ({ startMusic }: { startMusic: boolean }) => {
      setStarted(true);
      if (startMusic) {
        void music.play();
        // Kilau lembut sebagai tanda undangan dibuka.
        window.setTimeout(triggerSoftSparkle, 900);
      }
    },
    [music],
  );

  return (
    <>
      <OrnamentDefs />

      {/* ===== HALAMAN PEMBUKA ===== */}
      {!coverGone && (
        <CoverScreen
          config={config}
          guest={guest}
          onOpen={handleOpen}
          musicEnabled={config.music.enabled}
        />
      )}

      {/* ===== ISI UNDANGAN ===== */}
      <motion.main
        id="undangan"
        initial={false}
        animate={started ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        className={started ? 'relative' : 'pointer-events-none relative h-screen overflow-hidden'}
        aria-hidden={!started}
      >
        <HeroSection config={config} />

        <WayangTransition label="Wayang Dadi Manungsa — Swara Tresna" />

        <OpeningSection config={config} />
        <QuoteSection config={config} />

        <WayangTransition variant="srikandi" label="Gendhing Katresnan" />

        <CoupleSection config={config} />
        <EventsSection config={config} />
        <CountdownSection config={config} />
        <LoveStorySection config={config} />
        <GallerySection config={config} />
        <TraditionsSection config={config} />
        <VenueSection config={config} />
        <RsvpSection config={config} guest={guest} />
        <WishesSection config={config} guest={guest} />
        <GiftSection config={config} />
        <ClosingSection config={config} />

        {/* Bilah berbagi cadangan di akhir halaman */}
        {shareable && (
          <div className="flex justify-center pb-24 pt-4">
            <ShareBar title={config.meta.title} />
          </div>
        )}
      </motion.main>

      {/* ===== KONTROL MENGAMBANG ===== */}
      {coverGone && <div className="theme-wash-layer" aria-hidden="true" />}
      <MusicPlayer player={music} visible={started} />
      <NavDock ready={started} />

      {shareable && started && (
        <div className="fixed left-3 top-3 z-50 sm:left-5 sm:top-5">
          <ShareBar title={config.meta.title} />
        </div>
      )}
    </>
  );
}
