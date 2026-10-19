import { useEffect, useRef, useState } from 'react';
import { ImageOff } from 'lucide-react';
import { cn, initialsOf } from '../../lib/utils';

export interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  /** class untuk elemen <img> */
  imgClassName?: string;
  /** rasio aspek, mis. "3/4" */
  ratio?: string;
  /** Terapkan wash emas agar galeri terasa satu nada */
  duotone?: boolean;
  /** Muat segera (untuk cover/hero) */
  priority?: boolean;
  /** Monogram untuk fallback ornamen */
  monogramSeed?: string[];
  sizes?: string;
}

/**
 * Gambar dengan:
 *  · lazy loading + decoding async,
 *  · placeholder bertekstur batik selama memuat (bukan kotak kosong),
 *  · fallback ornamen monogram bila gambar gagal dimuat,
 *  · wash emas opsional agar seluruh galeri konsisten secara artistik.
 */
export function SmartImage({
  src,
  alt,
  className,
  imgClassName,
  ratio = '3/4',
  duotone = true,
  priority = false,
  monogramSeed = ['E', 'S'],
  sizes,
}: SmartImageProps) {
  const [state, setState] = useState<'loading' | 'ready' | 'error'>('loading');
  const ref = useRef<HTMLImageElement>(null);

  // Bila gambar sudah ada di cache, onLoad mungkin tidak terpanggil lagi.
  useEffect(() => {
    const img = ref.current;
    if (img?.complete && img.naturalWidth > 0) setState('ready');
  }, [src]);

  return (
    <div
      className={cn('relative overflow-hidden bg-jawa-deepbrown', className)}
      style={{ aspectRatio: ratio }}
    >
      {/* Placeholder bermotif batik */}
      {state !== 'ready' && (
        <div className="absolute inset-0 flex items-center justify-center bg-batik-kawung bg-jawa-deepbrown" aria-hidden="true">
          <svg className="absolute inset-0 h-full w-full opacity-[0.18]">
            <rect width="100%" height="100%" fill="url(#batikParang)" color="#C6A56B" />
          </svg>
          {state === 'loading' && (
            <span className="relative font-script text-4xl text-jawa-gold/50">
              {initialsOf(...monogramSeed)}
            </span>
          )}
        </div>
      )}

      {state === 'error' ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-jawa-deepbrown px-4 text-center">
          <svg className="absolute inset-0 h-full w-full opacity-20">
            <rect width="100%" height="100%" fill="url(#batikKawung)" color="#C6A56B" />
          </svg>
          <ImageOff size={22} className="relative text-jawa-gold/70" />
          <p className="relative font-serif text-xs italic text-jawa-beige/60">
            Foto akan segera tersedia
          </p>
        </div>
      ) : (
        <img
          ref={ref}
          src={src}
          alt={alt}
          sizes={sizes}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          onLoad={() => setState('ready')}
          onError={() => setState('error')}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-all duration-[1200ms] ease-out',
            state === 'ready' ? 'scale-100 opacity-100 blur-0' : 'scale-105 opacity-0 blur-md',
            imgClassName,
          )}
        />
      )}

      {/* Wash emas sinematik */}
      {duotone && state === 'ready' && (
        <div
          className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-70"
          style={{
            background:
              'linear-gradient(180deg, rgba(198,165,107,0.22) 0%, rgba(118,45,50,0.14) 45%, rgba(26,14,8,0.62) 100%)',
          }}
          aria-hidden="true"
        />
      )}

      {/* Bingkai dalam */}
      <div className="pointer-events-none absolute inset-0 border border-jawa-gold/25" aria-hidden="true" />
    </div>
  );
}
