import type { InvitationConfig, GuestContext } from '../../types/invitation';

/**
 * ============================================================================
 *  DATA UNDANGAN  ·  Demo "Jawa Royal" — Eliana & Syahril
 * ============================================================================
 *  ⚠️  UNTUK PRODUKSI:
 *  1. Ganti seluruh `photo` / `src` dengan foto asli pasangan
 *     (upload ke Supabase Storage, lalu tempel public URL di sini).
 *  2. Ganti `accounts` pada `gift` dengan rekening ASLI milik pasangan.
 *     Field ini sengaja diisi data demo — JANGAN dipakai saat produksi.
 *  3. Ganti `music.src` dengan file gamelan berlisensi milik pengguna.
 *     Jika dikosongkan, aplikasi memakai gamelan sintetis (Web Audio API).
 *  4. Isi `meta.ogImage` dengan foto landscape 1200x630 agar preview
 *     WhatsApp tampil menarik.
 * ============================================================================
 */

/** Helper: URL Unsplash dengan auto-format (WebP/AVIF) + kompresi */
const u = (id: string, w = 1200, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=72`;

export const jawaRoyal: InvitationConfig = {
  slug: 'eliana-syahril',
  status: 'published',
  plan: 'premium',
  template: 'jawa-royal',

  coverLabel: 'The Wedding of',
  heroTitle: 'Pawiwahan Ageng',
  openingText:
    'Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud menyelenggarakan pernikahan putra-putri kami. Tanpa mengurangi rasa hormat, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan memberikan doa restu.',
  hostLine: 'Keluarga Besar Bapak Ir. Bambang Waluyo & Ibu Sri Handayani',

  groom: {
    nickname: 'Syahril',
    fullName: 'Syahril Adi Nugraha, S.T.',
    childOrder: 'Putra pertama dari',
    father: 'Bapak H. Soemarno Adi Wijaya',
    mother: 'Ibu Hj. Retno Palupi',
    instagram: 'syahriladi',
    photo: u('1507003211169-0a1dd7228f2d', 800, 1000),
    photoAlt: 'Foto calon mempelai pria, Syahril Adi Nugraha',
  },

  bride: {
    nickname: 'Eliana',
    fullName: 'Eliana Ayu Pramesti, S.Psi.',
    childOrder: 'Putri kedua dari',
    father: 'Bapak Ir. Bambang Waluyo',
    mother: 'Ibu Sri Handayani',
    instagram: 'elianapramesti',
    photo: u('1494790108377-be9c29b29330', 800, 1000),
    photoAlt: 'Foto calon mempelai wanita, Eliana Ayu Pramesti',
  },

  weddingDateISO: '2026-12-31T08:00:00+07:00',
  weddingDateLabel: '31 Desember 2026',
  weddingDayLabel: 'Kamis',

  quote: {
    enabled: true,
    source: 'QS. Ar-Rum : 21',
    arabic:
      'وَمِنْ اٰيٰتِهٖٓ اَنْ خَلَقَ لَكُمْ مِّنْ اَنْفُسِكُمْ اَزْوَاجًا لِّتَسْكُنُوْٓا اِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَّوَدَّةً وَّرَحْمَةً ۗ اِنَّ فِيْ ذٰلِكَ لَاٰيٰتٍ لِّقَوْمٍ يَّتَفَكَّرُوْنَ',
    text: 'Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup dari jenismu sendiri, supaya kamu dapat ketenangan hati dan menjadikan kasih sayang di antara kamu. Sesungguhnya pada yang demikian itu benar-benar terdapat tanda-tanda bagi kaum yang berpikir.',
    translation:
      '"Witing tresno jalaran saka kulino" — cinta tumbuh karena terbiasa bersama. Semoga Allah melimpahkan keberkahan atas ikatan yang kami bina.',
  },

  events: [
    {
      id: 'akad',
      name: 'Akad Nikah',
      subtitle: 'Ijab Kabul',
      startISO: '2026-12-31T08:00:00+07:00',
      endISO: '2026-12-31T10:00:00+07:00',
      timeLabel: '08.00 – 10.00',
      timezone: 'WIB',
      venueName: 'Pendopo Agung Sasana Kencana',
      address: 'Jl. Malioboro No. 52, Gedongtengen',
      city: 'Yogyakarta, D.I. Yogyakarta 55271',
      mapsUrl: 'https://maps.google.com/?q=Pendopo+Agung+Yogyakarta',
      mapsEmbedUrl:
        'https://www.google.com/maps?q=Keraton+Yogyakarta&output=embed',
      note: 'Mohon hadir 15 menit sebelum acara dimulai.',
    },
    {
      id: 'resepsi',
      name: 'Resepsi',
      subtitle: 'Pawiwahan & Tasyakuran',
      startISO: '2026-12-31T11:00:00+07:00',
      endISO: '2026-12-31T14:00:00+07:00',
      timeLabel: '11.00 – 14.00',
      timezone: 'WIB',
      venueName: 'Pendopo Agung Sasana Kencana',
      address: 'Jl. Malioboro No. 52, Gedongtengen',
      city: 'Yogyakarta, D.I. Yogyakarta 55271',
      mapsUrl: 'https://maps.google.com/?q=Pendopo+Agung+Yogyakarta',
      note: 'Dilengkapi prosesi adat Jawa & ramah tamah.',
    },
  ],

  loveStory: {
    enabled: true,
    title: 'Kisah Tresna',
    subtitle: 'Lelakon katresnan kang tinulis dening Gusti',
    items: [
      {
        id: 'story-1',
        dateLabel: 'September 2019',
        title: 'Sepisanan Kepanggih',
        description:
          'Kami dipertemukan di sebuah acara budaya di Yogyakarta. Sebuah kebetulan yang ternyata bukan kebetulan — hanya takdir yang berkenan menyusunnya.',
        icon: 'meet',
      },
      {
        id: 'story-2',
        dateLabel: 'Februari 2021',
        title: 'Wiwit Sesambungan',
        description:
          'Obrolan panjang tentang gamelan, wayang, dan mimpi masa depan membuat kami sadar bahwa kami berjalan menuju arah yang sama.',
        icon: 'heart',
      },
      {
        id: 'story-3',
        dateLabel: 'Agustus 2024',
        title: 'Nglamar',
        description:
          'Di hadapan kedua keluarga, dengan doa dan restu, kami mengikat janji untuk melangkah bersama menuju jenjang pernikahan.',
        icon: 'ring',
      },
      {
        id: 'story-4',
        dateLabel: '31 Desember 2026',
        title: 'Pawiwahan',
        description:
          'Dengan menyebut nama Allah, kami menyempurnakan separuh agama kami. Semoga menjadi keluarga yang sakinah, mawaddah, warahmah.',
        icon: 'home',
      },
    ],
  },

  gallery: {
    enabled: true,
    title: 'Galeri Pawiwahan',
    subtitle: 'Sekilas potret perjalanan kami',
    photos: [
      { id: 'g1', src: u('1583939003579-730e3918a45a', 1200, 1500), alt: 'Foto prewedding pasangan di pendopo', caption: 'Di Pendopo, senja pertama' },
      { id: 'g2', src: u('1519741497674-611481863552', 1200, 900), alt: 'Dekorasi bunga dan cincin pernikahan', caption: 'Janji yang tersimpan' },
      { id: 'g3', src: u('1522673607200-164d1b6ce486', 1200, 1400), alt: 'Pasangan berjalan di taman keraton', caption: 'Langkah menuju pelaminan' },
      { id: 'g4', src: u('1606800052052-a08af7148866', 1200, 1000), alt: 'Potret pasangan dengan busana tradisional', caption: 'Busana adat, doa restu' },
      { id: 'g5', src: u('1511285560929-80b456fea0bc', 1200, 1500), alt: 'Momen kebersamaan pasangan', caption: 'Tresna kang tuwuh' },
      { id: 'g6', src: u('1523438885200-e635ba2c371e', 1200, 950), alt: 'Detail ornamen pernikahan', caption: 'Ornamen keraton' },
      { id: 'g7', src: u('1465495976277-4387d4b0b4c6', 1200, 1400), alt: 'Pasangan berpegangan tangan', caption: 'Tangan yang saling menggenggam' },
      { id: 'g8', src: u('1519225421980-715cb0215aed', 1200, 1250), alt: 'Suasana acara pernikahan', caption: 'Cahaya blencong' },
    ],
  },

  traditions: {
    enabled: true,
    title: 'Adat & Tradisi',
    subtitle: 'Rangkaian prosesi pernikahan Jawa',
    disclaimer:
      'Setiap keluarga memiliki tradisi yang berbeda. Rangkaian prosesi berikut kami pilih dan sesuaikan dengan adat keluarga kami — mohon maaf apabila terdapat perbedaan dengan tradisi di daerah Bapak/Ibu/Saudara/i.',
    items: [
      {
        id: 't1',
        name: 'Siraman',
        javaneseName: 'Siraman',
        description:
          'Prosesi memandikan calon pengantin dengan air bunga sebagai simbol penyucian diri, lahir dan batin, sebelum memasuki hidup baru.',
        enabled: true,
      },
      {
        id: 't2',
        name: 'Midodareni',
        javaneseName: 'Midodareni',
        description:
          'Malam sebelum akad, saat bidadari dipercaya turun memberi restu. Calon pengantin mengenakan busana terbaik dan berpuasa mutih.',
        enabled: true,
      },
      {
        id: 't3',
        name: 'Balangan Suruh',
        javaneseName: 'Balangan Suruh',
        description:
          'Kedua pengantin saling melempar sirih yang diikat benang. Simbol bahwa perbedaan pendapat akan selalu menemukan jalan damai.',
        enabled: true,
      },
      {
        id: 't4',
        name: 'Wiji Dadi',
        javaneseName: 'Wiji Dadi',
        description:
          'Mempelai pria menginjak telur ayam hingga pecah, lalu kaki wanita dibasuh dengan air bunga — lambang kesiapan menjadi ayah dan ibu.',
        enabled: true,
      },
      {
        id: 't5',
        name: 'Sinduran & Bobot Timbang',
        javaneseName: 'Sinduran',
        description:
          'Ayah mempelai wanita menyandarkan kedua pengantin di bahunya, lalu keduanya duduk di pangkuan sebagai simbol bobot, timbang, dan tanggung jawab yang setara.',
        enabled: true,
      },
      {
        id: 't6',
        name: 'Kacar Kucur',
        javaneseName: 'Kacar Kucur',
        description:
          'Mempelai pria menuangkan biji-bijian dan uang ke pangkuan mempelai wanita, simbol bahwa nafkah lahir dan batin akan ditunaikan dengan tanggung jawab.',
        enabled: true,
      },
      {
        id: 't7',
        name: 'Dahar Klimah',
        javaneseName: 'Dulangan',
        description:
          'Kedua pengantin saling menyuapi sebagai ungkapan kasih sayang pertama setelah resmi menjadi suami istri.',
        enabled: true,
      },
      {
        id: 't8',
        name: 'Sungkem Maring Wong Tua',
        javaneseName: 'Sungkem',
        description:
          'Pengantin bersimpuh memohon doa restu kepada orang tua dan sesepuh sebagai penutup rangkaian prosesi adat.',
        enabled: true,
      },
    ],
  },

  venue: {
    title: 'Lokasi Acara',
    subtitle: 'Sugeng rawuh wonten ing pawiwahan kami',
    description:
      'Acara diselenggarakan di Pendopo Agung Sasana Kencana, tepat di jantung pusat budaya Yogyakarta. Suasana pencahayaan sore hari akan menjadi bagian dari pengalaman Anda.',
    directions: [
      {
        id: 'd1',
        label: 'Menggunakan Mobil',
        detail:
          'Dari Jl. Malioboro, ambil arah utara menuju Jl. Margo Utomo. Tersedia area parkir di sisi timur pendopo (kapasitas ±80 kendaraan).',
      },
      {
        id: 'd2',
        label: 'Menggunakan Kereta',
        detail:
          'Turun di Stasiun Yogyakarta (Tugu), lanjut 8 menit berkendara ke arah selatan menuju pendopo.',
      },
      {
        id: 'd3',
        label: 'Transportasi Online',
        detail:
          'Titik penjemputan disarankan di gerbang utama Jl. Malioboro, kemudian berjalan kaki ±120 meter menuju pendopo.',
      },
    ],
    parking: 'Petugas parkir berjaga sejak pukul 07.00 WIB di gerbang timur.',
  },

  rsvp: {
    enabled: true,
    title: 'Konfirmasi Kehadiran',
    deadlineLabel: 'Mohon konfirmasi sebelum 24 Desember 2026',
  },

  wishes: {
    enabled: true,
    title: 'Ucapan & Doa',
    subtitle: 'Kirimkan doa terbaik untuk kedua mempelai',
    seed: [
      {
        id: 'w1',
        name: 'Keluarga Hartono',
        relation: 'keluarga',
        message:
          'Barakallahu lakuma wa baraka alaikuma wa jamaa bainakuma fii khairin. Selamat menempuh hidup baru, semoga menjadi keluarga yang sakinah, mawaddah, warahmah.',
        attendance: 'hadir',
        createdAt: Date.UTC(2026, 9, 2, 3, 12),
        approved: true,
      },
      {
        id: 'w2',
        name: 'Ayu & Dimas',
        relation: 'teman',
        message:
          'Turut berbahagia! Akhirnya kesabaran kalian berbuah manis. Semoga langgeng sampai kakek nenek ya. Tanjung Gusta!',
        attendance: 'hadir',
        createdAt: Date.UTC(2026, 9, 3, 8, 45),
        approved: true,
      },
      {
        id: 'w3',
        name: 'Bapak Sugeng Riyadi',
        relation: 'kolega',
        message:
          'Sugeng pawiwahan. Mugi Gusti tansah paring berkah lan kabagyan dhumateng panjenengan sedaya. Nuwun.',
        attendance: 'ragu',
        createdAt: Date.UTC(2026, 9, 5, 1, 30),
        approved: true,
      },
    ],
  },

  gift: {
    enabled: true,
    title: 'Amplop Digital',
    subtitle:
      'Doa restu Anda adalah hadiah terindah. Namun jika ingin memberi tanda kasih, kami sediakan kanal berikut.',
    accounts: [
      {
        id: 'acc-1',
        provider: 'Bank Mandiri',
        kind: 'bank',
        accountNumber: '1370012345678',
        accountName: 'Eliana Ayu Pramesti',
        brandColor: '#003D79',
        enabled: true,
      },
      {
        id: 'acc-2',
        provider: 'Bank BCA',
        kind: 'bank',
        accountNumber: '5271098765',
        accountName: 'Syahril Adi Nugraha',
        brandColor: '#0060AF',
        enabled: true,
      },
      {
        id: 'acc-3',
        provider: 'DANA',
        kind: 'ewallet',
        accountNumber: '0812-3456-7890',
        accountName: 'Eliana Ayu Pramesti',
        brandColor: '#118EEA',
        enabled: true,
      },
    ],
    address: {
      recipient: 'Eliana & Syahril',
      address:
        'Perumahan Griya Asri Blok C-12, Jl. Kaliurang Km 6, Sleman, Yogyakarta 55581',
      phone: '0812-3456-7890',
      enabled: true,
    },
  },

  closing: {
    text: 'Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai.',
    familyLine: 'Kami yang berbahagia,\nKeluarga Eliana & Syahril',
  },

  music: {
    enabled: true,
    // Kosongkan src untuk memakai gamelan sintetis (Web Audio API)
    // Isi dengan file milik pengguna untuk memakai lagu asli:
    // src: 'https://<project>.supabase.co/storage/v1/object/public/music/gamelan.mp3',
    src: undefined,
    title: 'Gendhing Ketawang — Gamelan Jawa',
    artist: 'Instrumental Tradisional',
  },

  meta: {
    title: 'The Wedding of Eliana & Syahril — 31 Desember 2026',
    description:
      'Undangan pernikahan Eliana & Syahril. Kamis, 31 Desember 2026 di Pendopo Agung Sasana Kencana, Yogyakarta. Kami menantikan kehadiran dan doa restu Anda.',
    ogImage: u('1583939003579-730e3918a45a', 1200, 630),
  },

  billing: {
    activeUntil: '2027-06-30T23:59:59+07:00',
    ownerEmail: 'demo@undanganjawa.id',
  },
};

/** Varian tema: palet ivory (terang) — dipakai untuk demonstrasi multi-template */
export const jawaIvory: InvitationConfig = {
  ...jawaRoyal,
  slug: 'jawa-ivory',
  template: 'jawa-ivory',
  status: 'preview',
  plan: 'free',
  meta: {
    ...jawaRoyal.meta,
    title: 'The Wedding of Eliana & Syahril — Ivory Edition',
    description: 'Varian tema ivory dari template Jawa Royal.',
  },
};

/** Varian tema: aksen maroon lebih pekat */
export const jawaMaroon: InvitationConfig = {
  ...jawaRoyal,
  slug: 'jawa-maroon',
  template: 'jawa-maroon',
  status: 'preview',
  meta: {
    ...jawaRoyal.meta,
    title: 'The Wedding of Eliana & Syahril — Maroon Edition',
    description: 'Varian tema maroon dari template Jawa Royal.',
  },
};

/** Registry semua undangan — nanti diganti query Supabase. */
export const invitationRegistry: Record<string, InvitationConfig> = {
  [jawaRoyal.slug]: jawaRoyal,
  [jawaIvory.slug]: jawaIvory,
  [jawaMaroon.slug]: jawaMaroon,
  'jawa-royal': jawaRoyal,
};

export const defaultGuest: GuestContext = {
  name: 'Bapak/Ibu/Saudara/i',
  label: 'Tamu Undangan',
};
