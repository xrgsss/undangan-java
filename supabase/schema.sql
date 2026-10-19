-- ============================================================================
--  SKEMA SUPABASE · Undangan Jawa
-- ============================================================================
--  Jalankan berkas ini di Supabase SQL Editor. Skema ini melengkapi
--  `LocalStorageRepository` yang dipakai versi demo — lihat
--  `supabase/README.md` untuk cara menyambungkannya ke aplikasi.
--
--  Prinsip:
--   1. Tamu (anon) TIDAK boleh membaca daftar konfirmasi mentah (privasi).
--      Yang tersedia untuk tamu hanya angka agregat lewat fungsi RPC.
--   2. Tamu boleh mengirim konfirmasi & ucapan, dengan batas panjang dan
--      pemeriksaan dasar di sisi database — bukan hanya di sisi klien.
--   3. Hanya pemilik undangan (authenticated + cocok email) yang boleh
--      membaca daftar mentah, memoderasi ucapan, dan mengubah undangan.
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- 1. UNDANGAN
-- ---------------------------------------------------------------------------
create table if not exists public.invitations (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  template      text not null default 'jawa-royal',
  status        text not null default 'draft'
                check (status in ('draft', 'preview', 'published', 'expired', 'archived')),
  plan          text not null default 'free' check (plan in ('free', 'premium')),
  owner_email   text,
  active_until  timestamptz,
  -- Seluruh isi undangan (mempelai, acara, galeri, dst.) sesuai InvitationConfig
  config        jsonb not null default '{}'::jsonb,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists invitations_slug_idx on public.invitations (slug);
create index if not exists invitations_owner_idx on public.invitations (owner_email);

-- ---------------------------------------------------------------------------
-- 2. KONFIRMASI KEHADIRAN (RSVP)
-- ---------------------------------------------------------------------------
create table if not exists public.rsvp_entries (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null references public.invitations (slug) on delete cascade,
  name        text not null check (char_length(btrim(name)) between 2 and 60),
  guests      smallint not null default 1 check (guests between 1 and 20),
  attendance  text not null check (attendance in ('hadir', 'tidak-hadir', 'ragu')),
  session     text check (session is null or char_length(session) <= 40),
  message     text check (message is null or char_length(message) <= 400),
  ip_hash     text,                                    -- untuk rate limit, bukan IP mentah
  created_at  timestamptz not null default now()
);

create index if not exists rsvp_slug_created_idx
  on public.rsvp_entries (slug, created_at desc);

-- ---------------------------------------------------------------------------
-- 3. UCAPAN & DOA
-- ---------------------------------------------------------------------------
create table if not exists public.wishes (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null references public.invitations (slug) on delete cascade,
  name        text not null check (char_length(btrim(name)) between 2 and 60),
  relation    text not null default 'lainnya' check (char_length(relation) <= 40),
  message     text not null check (char_length(btrim(message)) between 3 and 500),
  attendance  text check (attendance in ('hadir', 'tidak-hadir', 'ragu')),
  approved    boolean not null default true,
  ip_hash     text,
  created_at  timestamptz not null default now()
);

create index if not exists wishes_slug_created_idx
  on public.wishes (slug, created_at desc);
create index if not exists wishes_pending_idx
  on public.wishes (slug) where approved = false;

-- ---------------------------------------------------------------------------
-- 4. PEMBARUAN updated_at OTOMATIS
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists invitations_touch on public.invitations;
create trigger invitations_touch
  before update on public.invitations
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------------
-- 5. RATE LIMIT SEDERHANA BERBASIS DATABASE
--    Klien hanya boleh mengirim 5 konfirmasi / 5 ucapan per 10 menit.
--    (Lapisan kedua setelah rate limit di klien; WAJIB ada di server.)
-- ---------------------------------------------------------------------------
create or replace function public.assert_rate_limit(
  p_table text,
  p_slug text,
  p_ip_hash text,
  p_max int default 5,
  p_window interval default interval '10 minutes'
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  if p_ip_hash is null then
    return; -- tanpa penanda, batasi hanya lewat klien
  end if;

  if p_table = 'rsvp_entries' then
    select count(*) into v_count from public.rsvp_entries
     where slug = p_slug and ip_hash = p_ip_hash and created_at > now() - p_window;
  elsif p_table = 'wishes' then
    select count(*) into v_count from public.wishes
     where slug = p_slug and ip_hash = p_ip_hash and created_at > now() - p_window;
  else
    raise exception 'tabel tidak dikenal: %', p_table;
  end if;

  if v_count >= p_max then
    raise exception 'RATE_LIMIT' using errcode = 'P0001';
  end if;
end;
$$;

-- ---------------------------------------------------------------------------
-- 6. RPC PUBLIK (tanpa membuka akses baca ke tabel mentah)
-- ---------------------------------------------------------------------------

-- Ringkasan agregat untuk ditampilkan di bagian RSVP undangan.
create or replace function public.rsvp_summary(p_slug text)
returns table (hadir bigint, tidak_hadir bigint, ragu bigint, total_tamu bigint)
language sql
stable
security definer
set search_path = public
as $$
  select
    count(*) filter (where attendance = 'hadir')            as hadir,
    count(*) filter (where attendance = 'tidak-hadir')      as tidak_hadir,
    count(*) filter (where attendance = 'ragu')             as ragu,
    coalesce(sum(guests) filter (where attendance = 'hadir'), 0) as total_tamu
  from public.rsvp_entries
  where slug = p_slug;
$$;

-- Ucapan yang sudah disetujui, dengan paging.
create or replace function public.list_wishes(p_slug text, p_limit int default 30, p_offset int default 0)
returns table (id uuid, name text, relation text, message text, attendance text, created_at timestamptz)
language sql
stable
security definer
set search_path = public
as $$
  select w.id, w.name, w.relation, w.message, w.attendance, w.created_at
  from public.wishes w
  where w.slug = p_slug and w.approved
  order by w.created_at desc
  limit least(greatest(p_limit, 1), 100) offset greatest(p_offset, 0);
$$;

-- Kirim konfirmasi kehadiran.
create or replace function public.submit_rsvp(
  p_slug text,
  p_name text,
  p_guests smallint,
  p_attendance text,
  p_session text default null,
  p_message text default null,
  p_ip_hash text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if not exists (
    select 1 from public.invitations
    where slug = p_slug and status in ('published', 'preview')
  ) then
    raise exception 'INVITATION_NOT_FOUND' using errcode = 'P0002';
  end if;

  perform public.assert_rate_limit('rsvp_entries', p_slug, p_ip_hash);

  insert into public.rsvp_entries (slug, name, guests, attendance, session, message, ip_hash)
  values (
    p_slug,
    left(btrim(p_name), 60),
    p_guests,
    p_attendance,
    nullif(left(coalesce(p_session, ''), 40), ''),
    nullif(left(coalesce(p_message, ''), 400), ''),
    p_ip_hash
  )
  returning id into v_id;

  return v_id;
end;
$$;

-- Kirim ucapan. Ucapan yang mencurigakan masuk antrean moderasi.
create or replace function public.submit_wish(
  p_slug text,
  p_name text,
  p_relation text,
  p_message text,
  p_attendance text default null,
  p_ip_hash text default null
)
returns table (id uuid, approved boolean)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_msg text := left(btrim(p_message), 500);
  v_urls int;
  v_distinct_ratio numeric;
  v_ok boolean := true;
begin
  if not exists (
    select 1 from public.invitations
    where slug = p_slug and status in ('published', 'preview')
  ) then
    raise exception 'INVITATION_NOT_FOUND' using errcode = 'P0002';
  end if;

  perform public.assert_rate_limit('wishes', p_slug, p_ip_hash);

  -- Moderasi dasar (sama seperti di klien, tetapi dijalankan di server).
  v_urls := (select count(*) from regexp_matches(v_msg, 'https?://', 'g'));
  if v_urls > 1 then
    v_ok := false;
  end if;

  if char_length(regexp_replace(v_msg, '\s', '', 'g')) > 12 then
    select count(distinct c)::numeric / char_length(regexp_replace(v_msg, '\s', '', 'g'))
      into v_distinct_ratio
      from regexp_split_to_table(regexp_replace(v_msg, '\s', '', 'g'), '') as c;
    if v_distinct_ratio < 0.15 then
      v_ok := false;
    end if;
  end if;

  return query
  insert into public.wishes (slug, name, relation, message, attendance, approved, ip_hash)
  values (
    p_slug,
    left(btrim(p_name), 60),
    coalesce(nullif(left(btrim(p_relation), 40), ''), 'lainnya'),
    v_msg,
    p_attendance,
    v_ok,
    p_ip_hash
  )
  returning wishes.id, wishes.approved;
end;
$$;

-- ---------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------
alter table public.invitations  enable row level security;
alter table public.rsvp_entries enable row level security;
alter table public.wishes       enable row level security;

-- Undangan: semua orang boleh membaca yang terbit/pratinjau.
drop policy if exists invitations_read_public on public.invitations;
create policy invitations_read_public on public.invitations
  for select using (status in ('published', 'preview'));

-- Undangan: hanya pemilik yang boleh mengubah.
drop policy if exists invitations_owner_write on public.invitations;
create policy invitations_owner_write on public.invitations
  for all to authenticated
  using (owner_email = auth.jwt() ->> 'email')
  with check (owner_email = auth.jwt() ->> 'email');

-- RSVP: tidak ada akses baca untuk anon. Pemilik boleh membaca semua.
drop policy if exists rsvp_owner_read on public.rsvp_entries;
create policy rsvp_owner_read on public.rsvp_entries
  for select to authenticated
  using (
    exists (
      select 1 from public.invitations i
      where i.slug = rsvp_entries.slug and i.owner_email = auth.jwt() ->> 'email'
    )
  );

-- RSVP: tamu mengirim lewat RPC `submit_rsvp` (security definer),
-- sehingga tidak perlu policy INSERT untuk anon.

-- Ucapan: semua orang boleh membaca yang sudah disetujui.
drop policy if exists wishes_read_approved on public.wishes;
create policy wishes_read_approved on public.wishes
  for select using (approved = true);

-- Ucapan: pemilik boleh membaca & memoderasi semuanya.
drop policy if exists wishes_owner_manage on public.wishes;
create policy wishes_owner_manage on public.wishes
  for all to authenticated
  using (
    exists (
      select 1 from public.invitations i
      where i.slug = wishes.slug and i.owner_email = auth.jwt() ->> 'email'
    )
  )
  with check (
    exists (
      select 1 from public.invitations i
      where i.slug = wishes.slug and i.owner_email = auth.jwt() ->> 'email'
    )
  );

-- ---------------------------------------------------------------------------
-- 8. HAK AKSES FUNGSI
-- ---------------------------------------------------------------------------
revoke all on function public.submit_rsvp(text, text, smallint, text, text, text, text) from public;
revoke all on function public.submit_wish(text, text, text, text, text, text) from public;
grant execute on function public.submit_rsvp(text, text, smallint, text, text, text, text) to anon, authenticated;
grant execute on function public.submit_wish(text, text, text, text, text, text) to anon, authenticated;
grant execute on function public.rsvp_summary(text) to anon, authenticated;
grant execute on function public.list_wishes(text, int, int) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 9. DATA CONTOH (opsional — hapus sebelum produksi)
-- ---------------------------------------------------------------------------
insert into public.invitations (slug, template, status, plan, owner_email, config)
values (
  'eliana-syahril',
  'jawa-royal',
  'preview',
  'premium',
  'demo@undanganjawa.id',
  '{}'::jsonb
)
on conflict (slug) do nothing;
