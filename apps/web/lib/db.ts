import Database, { type Database as DatabaseType } from "better-sqlite3"
import path from "node:path"

const dbPath = path.join(process.cwd(), "sqlite.db")
export const db: DatabaseType = new Database(dbPath)

// Enable WAL mode for better concurrent reads
db.pragma("journal_mode = WAL")
