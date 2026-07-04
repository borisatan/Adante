import * as SQLite from 'expo-sqlite';

import { migrate } from './migrations';

// Context-free singleton: this module is shared by the app UI and the
// headless widget task handler, so it must never touch React.
let db: SQLite.SQLiteDatabase | null = null;

export function getDb(): SQLite.SQLiteDatabase {
  if (!db) {
    db = SQLite.openDatabaseSync('andante.db');
    db.execSync('PRAGMA journal_mode = WAL;');
    db.execSync('PRAGMA foreign_keys = ON;');
    migrate(db);
  }
  return db;
}
