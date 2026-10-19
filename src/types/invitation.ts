/**
 * ============================================================================
 *  INVITATION SCHEMA  ·  Digital Wedding Invitation Platform
 * ============================================================================
 *  Semua tampilan template (Jawa Royal, Minimal, dsb.) menerima objek
 *  `InvitationConfig`. Artinya: menambah pelanggan baru = menambah data,
 *  BUKAN mengubah kode sumber.
 * ---------------------------------------------------------------------------
 */

export type ThemeId = 'jawa-royal' | 'jawa-ivory' | 'jawa-maroon';

export interface ThemeTokens {
  /** Warna latar paling gelap (dark chocolate) */
  surfaceBase: string;
  /** Warna panel / kartu */
  surfacePanel: string;
  /** Warna emas utama */
  gold: string;
  /** Emas terang untuk highlight */
  goldBright: string;
  /** Warna teks utama */
  ink: string;
  /** Warna aksen (maroon) */
  accent: string;
  /** Overlay vignette */
  vignette: string;
}

export interface PersonProfile {
  /** Nama panggilan (dipakai untuk monogram & sapaan) */
  nickname: string;
  /** Nama lengkap termasuk gelar */
  fullName: string;
  /** Urutan kelahiran, mis. "Putra pertama dari" */
  childOrder: string;
  father: string;
  mother: string;
  /** Instagram handle tanpa '@' — opsional */
  instagram?: string;
  /** Path/URL foto */
  photo: string;
  /** Deskripsi singkat untuk alt text & aksesibilitas */
  photoAlt: string;
}

export interface EventSchedule {
  id: string;
  /** Label acara: "Akad Nikah" / "Resepsi" */
  name: string;
  /** Sub-label, mis. "Ijab Kabul" */
  subtitle: string;
  /** ISO 8601 date-time dengan offset, mis. 2026-12-31T08:00:00+07:00 */
  startISO: string;
  /** ISO 8601 end — opsional */
  endISO?: string;
  /** Label jam yang ditampilkan, mis. "08.00 – 10.00 WIB" */
  timeLabel: string;
  timezone: string;
  venueName: string;
  address: string;
  city: string;
  /** URL Google Maps (share link / place link) */
  mapsUrl: string;
  /** URL embed peta (opsional) */
  mapsEmbedUrl?: string;
  /** Catatan tambahan, mis. protokol kesehatan */
  note?: string;
}

export interface LoveStoryItem {
  id: string;
  /** Label waktu, mis. "2019" atau "Maret 2022" */
  dateLabel: string;
  title: string;
  description: string;
  /** Ikon dekoratif */
  icon: 'meet' | 'heart' | 'ring' | 'home' | 'star';
}

export interface GalleryPhoto {
  id: string;
  src: string;
  /** Thumbnail opsional untuk grid (lebih ringan) */
  thumb?: string;
  alt: string;
  caption?: string;
}

export interface TraditionItem {
  id: string;
  name: string;
  /** Nama dalam bahasa Jawa */
  javaneseName?: string;
  description: string;
  /** Apakah prosesi ini dijalankan oleh pasangan */
  enabled: boolean;
}

export interface BankAccount {
  id: string;
  provider: string;
  /** Jenis: bank / e-wallet */
  kind: 'bank' | 'ewallet' | 'qris';
  accountNumber: string;
  accountName: string;
  /** Warna brand untuk aksen kartu */
  brandColor?: string;
  enabled: boolean;
}

export interface GiftAddress {
  recipient: string;
  address: string;
  phone?: string;
  enabled: boolean;
}

export interface QuoteBlock {
  enabled: boolean;
  /** Sumber kutipan, mis. "QS. Ar-Rum: 21" */
  source: string;
  /** Teks Arab — opsional */
  arabic?: string;
  /** Isi kutipan */
  text: string;
  /** Terjemahan / penjelasan */
  translation?: string;
}

export interface MusicConfig {
  enabled: boolean;
  /** URL file audio (mp3/ogg) — kosongkan untuk memakai gamelan sintetis */
  src?: string;
  title: string;
  artist: string;
}

export interface RsvpEntry {
  id: string;
  name: string;
  guests: number;
  attendance: 'hadir' | 'tidak-hadir' | 'ragu';
  session?: string;
  message?: string;
  createdAt: number;
}

export interface WishEntry {
  id: string;
  name: string;
  /** 'keluarga' | 'teman' | 'kolega' | 'lainnya' */
  relation: string;
  message: string;
  attendance?: 'hadir' | 'tidak-hadir' | 'ragu';
  createdAt: number;
  /** Moderasi dasar — false berarti disembunyikan */
  approved?: boolean;
}

export interface InvitationConfig {
  /** Slug unik, dipakai pada URL /r/:slug */
  slug: string;
  /** Status publikasi */
  status: 'draft' | 'preview' | 'published' | 'expired' | 'archived';
  /** Paket berlangganan */
  plan: 'free' | 'premium';
  /** Template visual yang dipakai */
  template: ThemeId;

  /** Nama sapaan pada cover, mis. "The Wedding of" */
  coverLabel: string;
  /** Judul besar singkat di hero */
  heroTitle: string;
  /** Teks pembuka (section salam) */
  openingText: string;
  /** Nama keluarga / pihak yang mengundang */
  hostLine: string;

  groom: PersonProfile;
  bride: PersonProfile;

  /** Tanggal utama (ISO) — dipakai untuk countdown & metadata */
  weddingDateISO: string;
  /** Tanggal yang sudah diformat untuk tampilan */
  weddingDateLabel: string;
  /** Hari, mis. "Kamis" */
  weddingDayLabel: string;

  quote: QuoteBlock;

  events: EventSchedule[];

  loveStory: {
    enabled: boolean;
    title: string;
    subtitle: string;
    items: LoveStoryItem[];
  };

  gallery: {
    enabled: boolean;
    title: string;
    subtitle: string;
    photos: GalleryPhoto[];
  };

  traditions: {
    enabled: boolean;
    title: string;
    subtitle: string;
    /** Catatan disclaimer agar tidak mengasumsikan semua pasangan menjalankan prosesi yang sama */
    disclaimer: string;
    items: TraditionItem[];
  };

  venue: {
    title: string;
    subtitle: string;
    description: string;
    /** Panduan arah datang */
    directions: { id: string; label: string; detail: string }[];
    parking?: string;
  };

  rsvp: {
    enabled: boolean;
    title: string;
    deadlineLabel: string;
  };

  wishes: {
    enabled: boolean;
    title: string;
    subtitle: string;
    /** Ucapan awal yang ditampilkan sebelum tamu mengirim */
    seed: WishEntry[];
  };

  gift: {
    enabled: boolean;
    title: string;
    subtitle: string;
    accounts: BankAccount[];
    address: GiftAddress;
  };

  closing: {
    text: string;
    familyLine: string;
  };

  music: MusicConfig;

  /** Meta untuk Open Graph & WhatsApp preview */
  meta: {
    title: string;
    description: string;
    ogImage: string;
  };

  /** Info paket & masa aktif (ditampilkan di admin, bukan di undangan publik) */
  billing?: {
    activeUntil: string;
    ownerEmail: string;
  };
}

/** Data tamu yang di-inject lewat link personal ?to=Nama+Tamu */
export interface GuestContext {
  name: string;
  /** Label kecil di bawah nama, mis. "Tamu Undangan" */
  label: string;
}
