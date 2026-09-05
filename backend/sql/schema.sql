CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$ BEGIN CREATE TYPE role_type AS ENUM ('PLAYER','TEAM_CAPTAIN','TOURNAMENT_ORGANIZER','REFEREE','SPECTATOR','PLATFORM_ADMIN'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE tournament_status AS ENUM ('DRAFT','REGISTRATION_OPEN','REGISTRATION_CLOSED','IN_PROGRESS','COMPLETED','ARCHIVED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE match_status AS ENUM ('SCHEDULED','LIVE','AWAITING_CONFIRMATION','CONFIRMED','DISPUTED','RESOLVED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE dispute_status AS ENUM ('OPEN','UNDER_REVIEW','RESOLVED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(120) NOT NULL, email VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL, platform_admin BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name VARCHAR(160) UNIQUE NOT NULL, status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS org_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE, role role_type NOT NULL, joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, org_id)
);
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  name VARCHAR(180) NOT NULL, format VARCHAR(40) NOT NULL DEFAULT 'SINGLE_ELIMINATION', status tournament_status NOT NULL DEFAULT 'DRAFT',
  max_teams INT NOT NULL CHECK(max_teams > 1 AND max_teams <= 128), start_date TIMESTAMPTZ NOT NULL,
  rules TEXT NOT NULL DEFAULT '', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  captain_id UUID NOT NULL REFERENCES users(id), name VARCHAR(120) NOT NULL, seed INT, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(tournament_id, name)
);
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE, joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE(team_id, user_id)
);
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  round INT NOT NULL, match_number INT NOT NULL, team1_id UUID REFERENCES teams(id), team2_id UUID REFERENCES teams(id),
  winner_id UUID REFERENCES teams(id), score1 INT, score2 INT, status match_status NOT NULL DEFAULT 'SCHEDULED',
  scheduled_at TIMESTAMPTZ, next_match_id UUID REFERENCES matches(id), created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), UNIQUE(tournament_id, round, match_number)
);
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), match_id UUID NOT NULL UNIQUE REFERENCES matches(id) ON DELETE CASCADE,
  raised_by UUID NOT NULL REFERENCES users(id), resolved_by UUID REFERENCES users(id), reason TEXT NOT NULL,
  resolution TEXT, status dispute_status NOT NULL DEFAULT 'OPEN', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), resolved_at TIMESTAMPTZ
);
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(), user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL, is_read BOOLEAN NOT NULL DEFAULT FALSE, created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_members_org ON org_memberships(org_id);
CREATE INDEX IF NOT EXISTS idx_tournaments_org ON tournaments(org_id);
CREATE INDEX IF NOT EXISTS idx_teams_tournament ON teams(tournament_id);
CREATE INDEX IF NOT EXISTS idx_matches_tournament ON matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);
