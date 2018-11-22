CREATE TABLE manifest_content (
  id SERIAL PRIMARY KEY,
  manifest_id INTEGER NOT NULL REFERENCES manifest(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  edition_date TIMESTAMP NOT NULL
);
