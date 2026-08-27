-- ============================================================
-- Wunderlich Elektrotechnik – Supabase Datenbank-Schema
-- Dieses SQL im Supabase SQL-Editor ausführen:
-- Supabase Dashboard → SQL Editor → New Query → ausführen
-- ============================================================

-- Profile (verknüpft mit Supabase Auth)
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'employee' CHECK (role IN ('owner', 'employee')),
  phone text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Trigger: Profil automatisch anlegen wenn neuer Auth-User erstellt wird
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email), 'employee');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Kunden
CREATE TABLE customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  company text,
  street text,
  zip text,
  city text,
  phone text,
  email text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
);

-- Materialkatalog
CREATE TABLE materials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  unit text NOT NULL DEFAULT 'Stück',
  price_per_unit decimal(10,2) NOT NULL DEFAULT 0,
  category text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Bausteine (Angebotsvorlagen)
CREATE TABLE offer_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE offer_block_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  block_id uuid NOT NULL REFERENCES offer_blocks(id) ON DELETE CASCADE,
  position int NOT NULL DEFAULT 0,
  type text NOT NULL CHECK (type IN ('material', 'labor', 'text')),
  description text NOT NULL,
  material_id uuid REFERENCES materials(id),
  quantity decimal(10,2),
  unit text,
  unit_price decimal(10,2),
  labor_hours decimal(6,2)
);

-- Sequenz für Angebotsnummern
CREATE SEQUENCE offer_number_seq START 1;

-- Angebote
CREATE TABLE offers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_number text UNIQUE NOT NULL DEFAULT ('AN-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('offer_number_seq')::text, 3, '0')),
  customer_id uuid NOT NULL REFERENCES customers(id),
  title text NOT NULL,
  type text NOT NULL CHECK (type IN ('schaetzung', 'kva', 'festpreis')),
  status text NOT NULL DEFAULT 'entwurf' CHECK (status IN ('entwurf', 'gesendet', 'angenommen', 'abgelehnt')),
  inspection_date date,
  valid_until date,
  discount_percent decimal(5,2) NOT NULL DEFAULT 0,
  hourly_rate decimal(8,2),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES profiles(id)
);

CREATE TABLE offer_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_id uuid NOT NULL REFERENCES offers(id) ON DELETE CASCADE,
  position int NOT NULL DEFAULT 0,
  type text NOT NULL CHECK (type IN ('material', 'labor', 'heading', 'text')),
  description text NOT NULL,
  quantity decimal(10,2),
  unit text,
  unit_price decimal(10,2),
  labor_hours decimal(6,2),
  block_item_id uuid REFERENCES offer_block_items(id)
);

-- Sequenz für Rechnungsnummern
CREATE SEQUENCE invoice_number_seq START 1;

-- Rechnungen
CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL DEFAULT ('RE-' || to_char(now(), 'YYYY') || '-' || lpad(nextval('invoice_number_seq')::text, 3, '0')),
  offer_id uuid REFERENCES offers(id),
  customer_id uuid NOT NULL REFERENCES customers(id),
  status text NOT NULL DEFAULT 'entwurf' CHECK (status IN ('entwurf', 'gesendet', 'bezahlt', 'mahnung')),
  issue_date date DEFAULT CURRENT_DATE,
  due_date date,
  paid_date date,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
  position int NOT NULL DEFAULT 0,
  type text NOT NULL CHECK (type IN ('material', 'labor', 'heading', 'text')),
  description text NOT NULL,
  quantity decimal(10,2),
  unit text,
  unit_price decimal(10,2),
  labor_hours decimal(6,2)
);

-- Zeiterfassung
CREATE TABLE time_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  customer_id uuid REFERENCES customers(id),
  offer_id uuid REFERENCES offers(id),
  date date NOT NULL,
  work_hours decimal(4,2) NOT NULL DEFAULT 0,
  travel_hours decimal(4,2) NOT NULL DEFAULT 0,
  description text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Team-Verfügbarkeiten (Phase 2)
CREATE TABLE availability_slots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id),
  date date NOT NULL,
  start_time time,
  end_time time,
  available boolean NOT NULL DEFAULT true,
  notes text
);

-- ============================================================
-- Row Level Security (RLS) – nur eingeloggte User sehen Daten
-- ============================================================

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_block_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE offer_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE availability_slots ENABLE ROW LEVEL SECURITY;

-- Eingeloggte User sehen alles (Team-App, nicht öffentlich)
CREATE POLICY "Authenticated users can read all" ON profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated users can read all" ON customers FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can read all" ON materials FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can read all" ON offer_blocks FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can read all" ON offer_block_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can read all" ON offers FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can read all" ON offer_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can read all" ON invoices FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can read all" ON invoice_items FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can read all" ON time_entries FOR ALL TO authenticated USING (true);
CREATE POLICY "Authenticated users can read all" ON availability_slots FOR ALL TO authenticated USING (true);

-- Profil: User kann nur eigenes updaten
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
