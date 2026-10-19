import { useCallback, useEffect, useState } from 'react';

export interface RouteInfo {
  path: string;
  segments: string[];
  query: URLSearchParams;
  navigate: (to: string, opts?: { replace?: boolean }) => void;
}

function readLocation() {
  if (typeof window === 'undefined') return { path: '/', search: '' };
  return { path: window.location.pathname.replace(/\/+$/, '') || '/', search: window.location.search };
}

/**
 * Router minimalis berbasis History API.
 * Cukup untuk kebutuhan undangan (4 rute) tanpa menambah dependensi.
 * Klik pada <a data-link> ditangkap agar tidak memicu full page reload —
 * penting untuk menjaga musik tetap berjalan saat tamu berpindah rute.
 */
export function useRoute(): RouteInfo {
  const [loc, setLoc] = useState(readLocation);

  useEffect(() => {
    const onPop = () => setLoc(readLocation());
    window.addEventListener('popstate', onPop);

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0) return;
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const target = (e.target as HTMLElement)?.closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href || !href.startsWith('/') || href.startsWith('//')) return;
      if (target.hasAttribute('target')) return;
      e.preventDefault();
      window.history.pushState({}, '', href);
      setLoc(readLocation());
      window.scrollTo({ top: 0, behavior: 'auto' });
    };

    document.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('popstate', onPop);
      document.removeEventListener('click', onClick);
    };
  }, []);

  const navigate = useCallback((to: string, opts?: { replace?: boolean }) => {
    if (opts?.replace) window.history.replaceState({}, '', to);
    else window.history.pushState({}, '', to);
    setLoc(readLocation());
  }, []);

  return {
    path: loc.path,
    segments: loc.path.split('/').filter(Boolean),
    query: new URLSearchParams(loc.search),
    navigate,
  };
}
