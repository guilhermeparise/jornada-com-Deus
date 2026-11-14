create table public.devotional_entries (
  user_id uuid not null references auth.users(id) on delete cascade,
  devotional_date date not null,
  devotional_number smallint not null check (devotional_number between 1 and 30),
  reflection text not null default '',
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (user_id, devotional_date)
);

create index devotional_entries_user_completed_date_idx
  on public.devotional_entries (user_id, devotional_date desc)
  where completed = true;

insert into public.devotional_entries (
  user_id,
  devotional_date,
  devotional_number,
  reflection,
  completed,
  completed_at
)
select
  user_id,
  (completed_at at time zone 'America/Sao_Paulo')::date,
  min(day_number)::smallint,
  (array_agg(coalesce(reflection, '') order by completed_at desc))[1],
  true,
  max(completed_at)
from public.journey_progress
where completed = true and completed_at is not null
group by user_id, (completed_at at time zone 'America/Sao_Paulo')::date
on conflict (user_id, devotional_date) do nothing;

alter table public.devotional_entries enable row level security;
grant select, insert, update on public.devotional_entries to authenticated;

create policy "Users can read their devotional entries"
  on public.devotional_entries for select
  using (auth.uid() = user_id);

create policy "Users can create their devotional entries"
  on public.devotional_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their devotional entries"
  on public.devotional_entries for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

alter table public.push_subscriptions
  add column notification_time time not null default '08:00',
  add column timezone text not null default 'America/Sao_Paulo',
  add column last_notification_date date;

grant select, insert, update, delete on public.push_subscriptions to authenticated;
