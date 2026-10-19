# Undangan Jawa — Undangan Pernikahan Digital Adat Jawa

Undangan pernikahan bernuansa keraton Jawa yang dibangun sebagai **produk**
(multi-pelanggan), bukan sebagai satu halaman sekali pakai.

Seluruh teks, nama, tanggal, foto, dan rekening berasal dari satu objek
konfigurasi (`InvitationConfig`). Menambah pelanggan baru = menambah data,
bukan mengubah komponen.

---

## 1. Menjalankan

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build  →  dist/
npm run preview  # pratinjau hasil build
npm run lint     # oxlint
```

> **Windows/PowerShell:** jalankan perintah sebagai pemanggilan terpisah.
> `&&` bukan pemisah perintah yang valid di PowerShell.

---

## 2. Rute

| Rute | Isi |
| --- | --- |
| `/` | Halaman produk: katalog undangan, fitur, pembuat tautan tamu, paket |
| `/demo/:template` | Pratinjau template (tanpa tombol bagikan) — mis. `/demo/jawa-royal` |
| `/r/:slug` | Undangan tamu — mis. `/r/eliana-syahril` |
| `/r/:slug?to=Nama%20Tamu&label=Keluarga` | Undangan dengan nama tamu personal |
| `/admin` | Dasbor konfirmasi & ucapan |

Router ditulis sendiri di atas History API (`src/hooks/useRoute.ts`) agar
perpindahan halaman tidak memuat ulang dokumen — **musik latar tetap berjalan**.

> **Penting saat menayangkan.** Karena memakai History API, server harus
> mengarahkan semua permintaan ke `index.html` (SPA fallback). Untuk Netlify
> hal ini sudah disiapkan pada `public/_redirects`. Nginx:
> `try_files $uri /index.html;`. Vercel: aturan rewrite `/(.*) → /index.html`.
> Tanpa ini, tautan personal seperti `/r/eliana-syahril` akan menghasilkan 404.

---

## 3. Struktur

```
src/
  types/invitation.ts          Skema InvitationConfig + GuestContext
  data/invitations/
    index.ts                   Katalog: liveInvitations(), findInvitation(), …
    jawaRoyal.ts               Data demo (Eliana & Syahril) + varian tema
  components/
    ornaments/                 Gunungan, WayangFigure, Ornaments, JogloScene,
                               OrnamentDefs (semua orisinal, SVG murni)
    effects/Particles.tsx      Kelopak jatuh & bara naik
    cover/CoverScreen.tsx      Halaman pembuka + tirai emas
    sections/                  14 bagian undangan
    media/                     SmartImage (lazy + duotone), Lightbox
    layout/                    NavDock (navigasi bawah), ShareBar
    audio/MusicPlayer.tsx      Pemutar gamelan + visualisasi amplitudo nyata
    ui/                        primitives (Reveal, SectionShell, GoldButton…), Toast
  hooks/                       useRoute, useMusicPlayer, useCountdown, usePersistentState
  lib/
    repository.ts              InvitationRepository + implementasi localStorage
    gamelan.ts                 GamelanEngine (Web Audio API, bebas royalti)
    utils.ts                   Sanitasi, format tanggal, clipboard, dsb.
  pages/                       LandingPage, AdminPage, NotFoundPage
supabase/schema.sql            Skema database + RLS + RPC (belum tersambung)
docs/art/                      Sumber SVG yang dipakai untuk verifikasi visual
scripts/render-svg.mjs         Alat bantu dev: render SVG → PNG untuk diperiksa
```

---

## 4. Menambah undangan baru

1. Duplikat `src/data/invitations/jawaRoyal.ts`, ganti seluruh isinya.
2. Daftarkan di `invitationRegistry` pada berkas yang sama.
3. Tidak ada langkah ketiga — seluruh komponen sudah membaca dari objek itu.

Varian tema memakai `spread` data dasar dan hanya mengganti `template`,
`slug`, dan `meta` (lihat `jawaIvory` / `jawaMaroon`). Atribut
`data-theme` pada `<html>` yang mengubah suasana warna (`src/index.css`).

---

## 5. ⚠️ Wajib diganti sebelum produksi

- [ ] **Foto** — `gallery.photos[].src`, `groom.photo`, `bride.photo` masih
      memakai URL Unsplash. Ganti dengan foto asli pasangan
      (unggah ke Supabase Storage / CDN, lalu tempel URL publik).
- [ ] **Rekening** — `gift.accounts[]` masih berisi nomor dan nama pemilik
      rekening **contoh**. Jangan pernah tayangkan undangan tanpa menggantinya.
- [ ] **Musik** — `music.src` sengaja dikosongkan. Selama kosong, aplikasi
      memakai **gamelan sintetis** internal (Web Audio API) yang bebas royalti
      dan tetap berbunyi tanpa internet. Isi `music.src` hanya dengan berkas
      berlisensi milik Anda.
- [ ] **Gambar pratinjau WhatsApp** — `meta.ogImage` (disarankan 1200×630).
- [ ] **Alamat surel** pada halaman paket (`mailto:`) dan data contoh pada
      `supabase/schema.sql` bagian 9.

---

## 6. Yang **belum** ada (jangan diklaim sebaliknya)

| Fitur | Status |
| --- | --- |
| Pembayaran / langganan | **Tidak ada.** Tombol paket mengarah ke surel. |
| Login / akun pengguna | **Tidak ada.** `/admin` terbuka untuk siapa pun. |
| Penyimpanan data di server | **Tidak ada.** Repositori aktif = `localStorage`. |
| Proteksi anti-spam sisi server | **Belum aktif.** Sudah dirancang di `supabase/schema.sql`, tetapi belum tersambung. |

Versi demo menyimpan konfirmasi dan ucapan di peramban masing-masing tamu.
Artinya setiap perangkat melihat angka yang berbeda dan pasangan tidak dapat
melihat kiriman tamu dari perangkat lain. Modul `src/pages/AdminPage.tsx`
menampilkan peringatan ini secara eksplisit.

---

## 7. Menyambungkan Supabase (produksi)

1. Buat proyek Supabase, jalankan `supabase/schema.sql`.
2. `npm i @supabase/supabase-js`
3. Tambahkan `.env.local`:

   ```
   VITE_SUPABASE_URL=https://xxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=xxxx
   ```

   > **Hanya `anon key` di frontend.** `service_role` key tidak boleh pernah
   > dimasukkan ke bundel klien.

4. Buat `src/lib/repositorySupabase.ts` yang mengimplementasikan
   `InvitationRepository` — **tidak ada komponen UI yang perlu diubah**:

   ```ts
   import { createClient } from '@supabase/supabase-js';
   import type { InvitationRepository, SubmitResult } from './repository';
   import type { RsvpEntry, WishEntry } from '../types/invitation';

   const sb = createClient(
     import.meta.env.VITE_SUPABASE_URL,
     import.meta.env.VITE_SUPABASE_ANON_KEY,
   );

   export class SupabaseRepository implements InvitationRepository {
     async listRsvp(): Promise<RsvpEntry[]> {
       // Daftar mentah hanya untuk pemilik (dijaga RLS).
       const { data, error } = await sb
         .from('rsvp_entries')
         .select('*')
         .order('created_at', { ascending: false });
       if (error) throw error;
       return (data ?? []).map(mapRsvp);
     }

     async createRsvp(slug, input): Promise<SubmitResult<RsvpEntry>> {
       const { data, error } = await sb.rpc('submit_rsvp', {
         p_slug: slug,
         p_name: input.name,
         p_guests: input.guests,
         p_attendance: input.attendance,
         p_session: input.session ?? null,
         p_message: input.message ?? null,
       });
       if (error) return { ok: false, error: 'Gagal menyimpan konfirmasi.' };
       return { ok: true, data: { ...input, id: data as string, createdAt: Date.now() } };
     }

     async listWishes(slug: string, limit = 30): Promise<WishEntry[]> {
       const { data, error } = await sb.rpc('list_wishes', {
         p_slug: slug,
         p_limit: limit,
       });
       if (error) throw error;
       return (data ?? []).map(mapWish);
     }

     async createWish(slug, input): Promise<SubmitResult<WishEntry>> {
       const { data, error } = await sb.rpc('submit_wish', {
         p_slug: slug,
         p_name: input.name,
         p_relation: input.relation,
         p_message: input.message,
         p_attendance: input.attendance ?? null,
       });
       if (error) return { ok: false, error: 'Gagal mengirim ucapan.' };
       const row = Array.isArray(data) ? data[0] : data;
       return {
         ok: true,
         data: { ...input, id: row.id, approved: row.approved, createdAt: Date.now() },
         error: row.approved ? undefined : 'Ucapan Anda menunggu moderasi.',
       };
     }

     async summarize(slug: string) {
       const { data, error } = await sb.rpc('rsvp_summary', { p_slug: slug });
       if (error) throw error;
       const r = Array.isArray(data) ? data[0] : data;
       return {
         hadir: Number(r?.hadir ?? 0),
         tidakHadir: Number(r?.tidak_hadir ?? 0),
         ragu: Number(r?.ragu ?? 0),
         totalGuests: Number(r?.total_tamu ?? 0),
       };
     }
   }
   ```

5. Ganti satu baris di `src/lib/repository.ts`:

   ```ts
   export const activeRepository: InvitationRepository = new SupabaseRepository();
   ```

6. Aktifkan proteksi server: rate limit di dalam `submit_rsvp`/`submit_wish`
   memakai `ip_hash`. Isi `p_ip_hash` dari Supabase Edge Function
   (`request.headers['x-forwarded-for']` yang di-hash), bukan dari klien.

---

## 8. Aksesibilitas & performa

- `prefers-reduced-motion` dihormati: seluruh animasi CSS dimatikan, dan
  komponen Framer Motion memeriksa `useReducedMotion()` sebelum bergerak.
- Semua ornamen dekoratif ditandai `aria-hidden`; ilustrasi bermakna punya
  `aria-label`. Tombol ikon selalu punya `aria-label`.
- Musik **tidak pernah autoplay** — hanya mulai setelah tamu menekan
  "Buka Undangan" (sesuai kebijakan autoplay peramban).
- Gambar lambat-dimuat dengan placeholder bermotif batik, duotone emas, serta
  fallback bila gagal dimuat. Peta hanya dirender ketika diminta.
- Bundel dipecah per-vendor (`vendor-react`, `vendor-motion`, `vendor-icons`)
  agar dapat di-cache terpisah; halaman `/admin` dan 404 dimuat dinamis.
- Sanitasi input berlapis (`sanitizeText`/`sanitizeName`), pembatasan panjang,
  dan moderasi spam dasar ada di klien **dan** dirancang di database.

---

## 9. Ornamen

Tidak ada gambar stok maupun klipart. Seluruh ornamen digambar sebagai SVG:

- `Gunungan` — pohon hayat dengan lidah api dan lingkaran cahaya blencong.
- `WayangFigure` — Arjuna & Srikandi bergaya wayang kulit (tone emas/marun/ivory),
  dengan animasi `wayang-sway`, `wayang-arm`, `wayang-head` seperti dimainkan dalang.
- `Ornaments` — sudut bunga, melati, pembatas ukir, panel batik, ukel, monogram.
- `JogloScene` — enam lapis arsitektur joglo dengan paralaks gulir berbeda.
- `OrnamentDefs` — gradien, filter, dan pola batik (parang, kawung, truntum,
  ceplok, ukiran, awan ukel) yang dipakai ulang lewat `url(#…)`.

Berkas di `docs/art/` adalah sumber yang dipakai untuk memeriksa hasil render
secara visual (`node scripts/render-svg.mjs`). Keduanya alat bantu
pengembangan dan tidak ikut ke bundel produksi.

---

## 10. Lisensi aset

Semua kode, ornamen, dan gamelan sintetis dibuat untuk proyek ini.
Foto contoh berasal dari Unsplash (hanya untuk pratinjau) dan **wajib**
diganti sebelum undangan ditayangkan ke publik.
