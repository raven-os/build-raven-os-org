CREATE TABLE builds (
  id INTEGER UNSIGNED NOT NULL AUTO_INCREMENT UNIQUE PRIMARY KEY,
  manifest TEXT NOT NULL,
  name TEXT NOT NULL,
  running BOOLEAN NOT NULL,
  queuing BOOLEAN NOT NULL,
  exit_status INTEGER,
  output TEXT,
  created_at DATETIME NOT NULL,
  started_at DATETIME,
  ended_at DATETIME
);
