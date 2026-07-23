// Run once: npx tsx lib/migrate-additions.ts
// Adds reply support and view tracking to existing database

import { db } from "./db"

// Add parent_id for comment replies (ignore error if already exists)
try {
  db.exec(`ALTER TABLE comments ADD COLUMN parent_id TEXT REFERENCES comments(id)`)
  console.log("Added parent_id column")
} catch {
  console.log("parent_id already exists, skipping")
}

// Add view tracking table
db.exec(`
  CREATE TABLE IF NOT EXISTS page_views (
    slug TEXT PRIMARY KEY NOT NULL,
    count INTEGER NOT NULL DEFAULT 0
  );
`)
console.log("page_views table ready")
