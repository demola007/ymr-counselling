-- Target schema for the City Takers rebuild (runs once when the local Postgres
-- volume is first created). The FastAPI service will own this through Alembic;
-- this file lets the frontend team and the API share one local database today.
--
-- Key change from 2024/2025: every record belongs to an edition (YMR year), so
-- the portal can switch years and compare them.

CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS editions (
  year        integer PRIMARY KEY,
  number      integer NOT NULL UNIQUE,          -- 1st, 2nd ... 10th
  theme       text    NOT NULL,
  starts_on   date    NOT NULL,
  ends_on     date    NOT NULL,
  venue       text,
  flyer_url   text,
  is_current  boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS editions_one_current ON editions (is_current) WHERE is_current;

DO $$ BEGIN
  CREATE TYPE staff_role AS ENUM ('user', 'admin', 'super-admin');
  CREATE TYPE staff_status AS ENUM ('pending', 'active', 'deactivated');
  CREATE TYPE follow_up_status AS ENUM ('new', 'contacted', 'connected', 'discipled', 'unreachable');
  CREATE TYPE counsellee_status AS ENUM ('pending', 'assigned', 'in-session', 'follow-up', 'resolved');
  CREATE TYPE urgency AS ENUM ('low', 'medium', 'high');
  CREATE TYPE record_source AS ENUM ('form-upload', 'web-form', 'manual', 'import');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- One table for everyone who can sign in (replaces users + counsellors logins)
CREATE TABLE IF NOT EXISTS staff (
  id                  bigserial PRIMARY KEY,
  name                text NOT NULL,
  email               citext UNIQUE NOT NULL,
  password_hash       text,
  phone_number        text,
  gender              text,
  role                staff_role   NOT NULL DEFAULT 'user',
  status              staff_status NOT NULL DEFAULT 'pending',
  country             text,
  state               text,
  denomination        text,
  years_of_experience integer NOT NULL DEFAULT 0,
  has_certification   boolean NOT NULL DEFAULT false,
  specialties         text[]  NOT NULL DEFAULT '{}',
  profile_image_url   text,
  last_active_at      timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now()
);

-- Which editions each staff member served
CREATE TABLE IF NOT EXISTS staff_editions (
  staff_id    bigint  NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
  edition     integer NOT NULL REFERENCES editions(year),
  will_attend boolean NOT NULL DEFAULT true,
  PRIMARY KEY (staff_id, edition)
);

CREATE TABLE IF NOT EXISTS converts (
  id                         bigserial PRIMARY KEY,
  edition                    integer NOT NULL REFERENCES editions(year),
  name                       text,
  gender                     text,
  email                      text,
  phone_number               text,
  date_of_birth              text,
  age_group                  text,
  relationship_status        text,
  country                    text,
  state                      text,
  address                    text,
  nearest_bus_stop           text,
  is_student                 boolean DEFAULT false,
  school                     text,
  occupation                 text,
  denomination               text,
  online                     boolean DEFAULT false,
  availability_for_follow_up boolean NOT NULL DEFAULT true,
  follow_up_status           follow_up_status NOT NULL DEFAULT 'new',
  assigned_to                bigint REFERENCES staff(id) ON DELETE SET NULL,
  last_contacted_at          timestamptz,
  source                     record_source NOT NULL DEFAULT 'manual',
  form_image_url             text,
  created_at                 timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS converts_edition_idx ON converts (edition, created_at DESC);
CREATE INDEX IF NOT EXISTS converts_status_idx  ON converts (edition, follow_up_status);
CREATE INDEX IF NOT EXISTS converts_phone_idx   ON converts (phone_number);

CREATE TABLE IF NOT EXISTS counsellees (
  id                  bigserial PRIMARY KEY,
  edition             integer NOT NULL REFERENCES editions(year),
  reference           text UNIQUE NOT NULL,
  name                text,
  gender              text,
  email               text,
  phone_number        text,
  date_of_birth       text,
  age_group           text,
  relationship_status text,
  country             text,
  state               text,
  address             text,
  nearest_bus_stop    text,
  is_student          boolean DEFAULT false,
  school              text,
  occupation          text,
  denomination        text,
  counselling_reason  text,
  topics              text[]   NOT NULL DEFAULT '{}',   -- AI classified
  urgency             urgency  NOT NULL DEFAULT 'low',  -- AI triage
  preferred_mode      text,
  status              counsellee_status NOT NULL DEFAULT 'pending',
  assigned_to         bigint REFERENCES staff(id) ON DELETE SET NULL,
  session_at          timestamptz,
  counsellor_comments text,
  source              record_source NOT NULL DEFAULT 'web-form',
  created_at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS counsellees_edition_idx ON counsellees (edition, created_at DESC);
CREATE INDEX IF NOT EXISTS counsellees_triage_idx  ON counsellees (edition, status, urgency);

-- Contact history for converts and counsellees (calls, notes, status changes)
CREATE TABLE IF NOT EXISTS timeline_entries (
  id           bigserial PRIMARY KEY,
  convert_id   bigint REFERENCES converts(id) ON DELETE CASCADE,
  counsellee_id bigint REFERENCES counsellees(id) ON DELETE CASCADE,
  staff_id     bigint REFERENCES staff(id) ON DELETE SET NULL,
  type         text NOT NULL,     -- note | call | sms | email | whatsapp | status | assignment | created
  text         text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  CHECK ((convert_id IS NULL) <> (counsellee_id IS NULL))
);

CREATE TABLE IF NOT EXISTS message_templates (
  id          bigserial PRIMARY KEY,
  name        text UNIQUE NOT NULL,
  channel     text NOT NULL,      -- email | sms | whatsapp
  category    text NOT NULL,
  subject     text,
  body        text NOT NULL,
  html_body   text,
  provider_template_id text,      -- e.g. the Meta-approved WhatsApp template name
  updated_at  timestamptz NOT NULL DEFAULT now(),
  created_by  bigint REFERENCES staff(id)
);

-- One row per send (campaign); one row per recipient for delivery tracking
CREATE TABLE IF NOT EXISTS notification_batches (
  id            uuid PRIMARY KEY,
  edition       integer NOT NULL REFERENCES editions(year),
  channel       text NOT NULL,
  provider      text NOT NULL,
  audience      text NOT NULL,
  audience_label text NOT NULL,
  subject       text,
  message       text NOT NULL,
  template_id   bigint REFERENCES message_templates(id),
  status        text NOT NULL,    -- queued | sending | sent | partial | failed | scheduled
  total         integer NOT NULL,
  delivered     integer NOT NULL DEFAULT 0,
  failed        integer NOT NULL DEFAULT 0,
  opened        integer,
  cost_ngn      numeric(12,2) NOT NULL DEFAULT 0,
  scheduled_for timestamptz,
  created_by    bigint REFERENCES staff(id),
  created_at    timestamptz NOT NULL DEFAULT now(),
  completed_at  timestamptz
);
CREATE INDEX IF NOT EXISTS notification_batches_edition_idx ON notification_batches (edition, created_at DESC);

CREATE TABLE IF NOT EXISTS notification_recipients (
  id                  bigserial PRIMARY KEY,
  batch_id            uuid NOT NULL REFERENCES notification_batches(id) ON DELETE CASCADE,
  recipient_kind      text NOT NULL,   -- convert | counsellee | staff
  recipient_id        bigint NOT NULL,
  address             text NOT NULL,
  status              text NOT NULL DEFAULT 'pending', -- pending | delivered | read | failed
  error               text,
  provider_message_id text,
  updated_at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS notification_recipients_batch_idx ON notification_recipients (batch_id, status);
CREATE INDEX IF NOT EXISTS notification_recipients_provider_idx ON notification_recipients (provider_message_id);

CREATE TABLE IF NOT EXISTS activity_log (
  id         bigserial PRIMARY KEY,
  edition    integer REFERENCES editions(year),
  staff_id   bigint REFERENCES staff(id) ON DELETE SET NULL,
  kind       text NOT NULL,
  action     text NOT NULL,
  target     text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS exports (
  id         bigserial PRIMARY KEY,
  staff_id   bigint REFERENCES staff(id) ON DELETE SET NULL,
  dataset    text NOT NULL,
  editions   integer[] NOT NULL,
  format     text NOT NULL,
  row_count  integer NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO editions (year, number, theme, starts_on, ends_on, venue, is_current) VALUES
  (2024, 8,  'Floodgates',   '2024-12-26', '2024-12-30', 'Redemption City', false),
  (2025, 9,  'The New Army', '2025-12-26', '2025-12-30', 'Redemption City', false),
  (2026, 10, 'City Takers',  '2026-12-26', '2026-12-30', 'Old Auditorium, Redemption City of God', true)
ON CONFLICT (year) DO NOTHING;
