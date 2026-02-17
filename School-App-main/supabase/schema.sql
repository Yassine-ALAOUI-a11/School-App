-- Enable necessary extensions
create extension if not exists "uuid-ossp";

-- 1. USERS TABLE (Extends Supabase Auth)
create table public.users (
  id uuid references auth.users not null primary key,
  email text not null,
  role text check (role in ('student', 'agent', 'admin')) not null default 'student',
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.users enable row level security;

-- Policies for users
create policy "Users can view their own profile" on public.users
  for select using (auth.uid() = id);

create policy "Admins and Agents can view all profiles" on public.users
  for select using (
    exists (
      select 1 from public.users where id = auth.uid() and role in ('admin', 'agent')
    )
  );

-- 2. ACADEMIC YEARS
create table public.academic_years (
  id uuid default uuid_generate_v4() primary key,
  name text not null, -- e.g., "2023-2024"
  start_date date not null,
  end_date date not null,
  is_active boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.academic_years enable row level security;

create policy "Everyone can view active academic years" on public.academic_years
  for select using (true);

create policy "Admins can manage academic years" on public.academic_years
  for all using (
    exists (
      select 1 from public.users where id = auth.uid() and role = 'admin'
    )
  );

-- 3. MAJORS (Filières)
create table public.majors (
  id uuid default uuid_generate_v4() primary key,
  name text not null, -- e.g., "Génie Informatique"
  code text not null, -- e.g., "GI"
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.majors enable row level security;

create policy "Everyone can view majors" on public.majors
  for select using (true);

create policy "Admins can manage majors" on public.majors
  for all using (
    exists (
      select 1 from public.users where id = auth.uid() and role = 'admin'
    )
  );

-- 4. STUDENTS (Profile details)
create table public.students (
  id uuid references public.users(id) not null primary key,
  cne text unique, -- Code National de l'Étudiant or MASSAR
  cin text unique, -- Carte d'Identité Nationale
  birth_date date,
  address text,
  phone text,
  photo_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.students enable row level security;

create policy "Students can view and update their own details" on public.students
  for all using (auth.uid() = id);

create policy "Admins and Agents can view all students" on public.students
  for select using (
    exists (
      select 1 from public.users where id = auth.uid() and role in ('admin', 'agent')
    )
  );

-- 5. REGISTRATIONS (Inscriptions)
create table public.registrations (
  id uuid default uuid_generate_v4() primary key,
  student_id uuid references public.students(id) not null,
  academic_year_id uuid references public.academic_years(id) not null,
  major_id uuid references public.majors(id) not null,
  level text check (level in ('1ère année', '2ème année', 'Licence')) not null,
  status text check (status in ('pending', 'validated', 'rejected')) default 'pending',
  rejection_reason text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.registrations enable row level security;

create policy "Students can view their own registrations" on public.registrations
  for select using (auth.uid() = student_id);

create policy "Students can create registrations" on public.registrations
  for insert with check (auth.uid() = student_id);

create policy "Admins and Agents can view and update registrations" on public.registrations
  for all using (
    exists (
      select 1 from public.users where id = auth.uid() and role in ('admin', 'agent')
    )
  );

-- 6. DOCUMENTS
create table public.documents (
  id uuid default uuid_generate_v4() primary key,
  registration_id uuid references public.registrations(id) not null,
  type text check (type in ('CIN', 'BAC', 'RELEVE_NOTES', 'PHOTO', 'AUTRE')) not null,
  file_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.documents enable row level security;

create policy "Students can view and upload their own documents" on public.documents
  for all using (
    exists (
      select 1 from public.registrations r
      where r.id = documents.registration_id and r.student_id = auth.uid()
    )
  );

create policy "Admins and Agents can view all documents" on public.documents
  for select using (
    exists (
      select 1 from public.users where id = auth.uid() and role in ('admin', 'agent')
    )
  );

-- TRIGGER to handle new user creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', coalesce(new.raw_user_meta_data->>'role', 'student'));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- SEED DATA (Données initiales pour test)
insert into public.academic_years (name, start_date, end_date, is_active)
values ('2023-2024', '2023-09-01', '2024-06-30', true);

insert into public.majors (name, code, description)
values 
('Génie Informatique', 'GI', 'Formation en développement et réseaux'),
('Techniques de Management', 'TM', 'Gestion et commerce'),
('Génie Électrique', 'GE', 'Électronique et automatisme');
