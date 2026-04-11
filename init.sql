CREATE TABLE IF NOT EXISTS sessions (
  id SERIAL PRIMARY KEY,
  session_id UUID NOT NULL UNIQUE,
  participant_code TEXT,
  player_name TEXT,
  degree TEXT,
  age_group TEXT,
  agreed_to_research BOOLEAN NOT NULL DEFAULT FALSE,
  latest_points INTEGER DEFAULT 0,
  latest_task INTEGER DEFAULT 0,
  latest_status TEXT DEFAULT 'in_progress',
  feedback TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP,
  completed_at TIMESTAMP
);

CREATE TABLE IF NOT EXISTS progress_logs (
  id SERIAL PRIMARY KEY,
  session_id UUID NOT NULL,
  player_name TEXT,
  points INTEGER DEFAULT 0,
  current_task INTEGER DEFAULT 0,

  case1_score INTEGER DEFAULT 0,
  case2_score INTEGER DEFAULT 0,
  case3_score INTEGER DEFAULT 0,
  case4_score INTEGER DEFAULT 0,
  case5_score INTEGER DEFAULT 0,
  case6_score INTEGER DEFAULT 0,
  case7_score INTEGER DEFAULT 0,
  case8_score INTEGER DEFAULT 0,
  case9_score INTEGER DEFAULT 0,
  case10_score INTEGER DEFAULT 0,
  case11_score INTEGER DEFAULT 0,

  case5_choices JSONB,
  case6_choices JSONB,
  case7_choices JSONB,
  case8_choices JSONB,
  case9_choices JSONB,
  case10_choices JSONB,
  case11_choices JSONB,

  elapsed_seconds INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'in_progress',
  saved_at TIMESTAMP NOT NULL DEFAULT NOW(),

  CONSTRAINT fk_session
    FOREIGN KEY (session_id)
    REFERENCES sessions(session_id)
    ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION set_progress_log_player_name()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.player_name IS NULL THEN
    SELECT s.player_name
    INTO NEW.player_name
    FROM sessions s
    WHERE s.session_id = NEW.session_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_set_progress_log_player_name ON progress_logs;

CREATE TRIGGER trg_set_progress_log_player_name
BEFORE INSERT ON progress_logs
FOR EACH ROW
EXECUTE FUNCTION set_progress_log_player_name();