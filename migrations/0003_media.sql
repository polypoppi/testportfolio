-- Images are stored in D1 (resized in the browser first), so no R2 bucket or card on file is needed.
CREATE TABLE media (
  key TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  data BLOB NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
