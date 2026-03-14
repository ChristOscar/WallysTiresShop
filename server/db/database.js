const Database = require('better-sqlite3');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const dbPath = process.env.DATABASE_PATH || './db/tires.db';
const resolvedPath = path.resolve(__dirname, '..', dbPath);

const db = new Database(resolvedPath);

// Enable WAL mode for better concurrent read performance
db.pragma('journal_mode = WAL');

// Create schema
db.exec(`
  CREATE TABLE IF NOT EXISTS tires (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    brand TEXT NOT NULL,
    width INTEGER NOT NULL,
    aspect_ratio INTEGER NOT NULL,
    rim_size INTEGER NOT NULL,
    type TEXT NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    price REAL,
    condition TEXT DEFAULT 'New',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TRIGGER IF NOT EXISTS update_tires_timestamp
    AFTER UPDATE ON tires
    BEGIN
      UPDATE tires SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
`);

module.exports = db;
