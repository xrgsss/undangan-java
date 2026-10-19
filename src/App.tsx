import { lazy, Suspense, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useRoute } from './hooks/useRoute';
import { defaultGuest, findInvitation, findByTemplate } from './data/invitations';
import { InvitationTemplate } from './components/invitation/InvitationTemplate';
import { LandingPage } from './pages/LandingPage';
import { sanitizeName, sanitizeText } from './lib/utils';
import type { GuestContext } from './types/invitation';

/** Halaman yang jarang dibuka dimuat terpisah agar undangan tetap ringan. */
const AdminPage = lazy(() =>
  import('./pages/AdminPage').then((m) => ({ default: m.AdminPage })),
);
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

/** Layar tunggu bergaya emas saat potongan halaman sedang diunduh. */
function RouteFallback() {
  return (
    <div className="flex min-h-[100svh] flex-col items-center justify-center gap-4">
      <motion.span
        className="block h-10 w-10 rounded-full border border-jawa-gold/30 border-t-jawa-goldlight"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.1, repeat: Infinity, ease: 'linear' }}
        aria-hidden="true"
      />
      <p className="font-cinzel text-[10px] uppercase tracking-[0.4em] text-jawa-beige/60">
        Memuat…
      </p>
    </div>
  );
}

/**
 * ============================================================================
 *  ROUTER APLIKASI
 * ============================================================================
 *  /                      → halaman produk (katalog + alat tautan tamu)
 *  /demo/:template        → pratinjau template (tanpa tombol bagikan)
 *  /r/:slug               → undangan tamu  (?to=Nama&label=Keterangan)
 *  /admin                 → dasbor konfirmasi & ucapan
 *  *                      → 404
 * ============================================================================
 */
export default function App() {
  const { segments, query, navigate, path } = useRoute();

  /** Data tamu dibaca dari URL; tidak pernah ditulis di dalam komponen. */
  const guest = useMemo<GuestContext>(() => {
    const name = sanitizeName(query.get('to') ?? '');
    const label = sanitizeText(query.get('label') ?? '', 40);
    return {
      name: name || defaultGuest.name,
      label: label || defaultGuest.label,
    };
  }, [query]);

  const view = useMemo(() => {
    const [first, second] = segments;

    if (!first) return { kind: 'landing' as const };
    if (first === 'admin') return { kind: 'admin' as const };

    if ((first === 'r' || first === 'demo') && second) {
      const config =
        first === 'demo' ? findByTemplate(second) : findInvitation(second);
      if (config) {
        return {
          kind: 'invitation' as const,
          config,
          shareable: first !== 'demo',
        };
      }
    }

    return { kind: 'notfound' as const };
  }, [segments]);

  // Setiap perpindahan rute langsung kembali ke atas halaman.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
    // Undangan menetapkan tema sendiri; halaman lain memakai tema dasar.
    if (view.kind !== 'invitation') {
      document.documentElement.setAttribute('data-theme', 'jawa-royal');
    }
  }, [path, view]);

  if (view.kind === 'landing') return <LandingPage navigate={navigate} />;
  if (view.kind === 'invitation') {
    return (
      <InvitationTemplate
        key={`${view.config.slug}:${guest.name}`}
        config={view.config}
        guest={guest}
        shareable={view.shareable}
      />
    );
  }
  return (
    <Suspense fallback={<RouteFallback />}>
      {view.kind === 'admin' ? (
        <AdminPage navigate={navigate} />
      ) : (
        <NotFoundPage navigate={navigate} />
      )}
    </Suspense>
  );
}
