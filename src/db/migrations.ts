import type { SQLiteDatabase } from 'expo-sqlite';

interface Migration {
  version: number;
  statements: string[];
}

const migrations: Migration[] = [
  {
    version: 1,
    statements: [
      `CREATE TABLE habits (
        id               TEXT PRIMARY KEY,
        name             TEXT NOT NULL,
        description      TEXT NOT NULL DEFAULT '',
        icon             TEXT NOT NULL DEFAULT 'activity',
        color            TEXT NOT NULL,
        goal_type        TEXT NOT NULL DEFAULT 'daily'
                           CHECK (goal_type IN ('daily','weekly')),
        times_per_week   INTEGER NOT NULL DEFAULT 7,
        reminder_time    TEXT,
        reminder_days    TEXT NOT NULL DEFAULT '[]',
        notification_ids TEXT NOT NULL DEFAULT '[]',
        position         INTEGER NOT NULL DEFAULT 0,
        archived_at      TEXT,
        created_at       TEXT NOT NULL
      );`,
      `CREATE TABLE completions (
        habit_id   TEXT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
        date       TEXT NOT NULL,
        created_at TEXT NOT NULL,
        PRIMARY KEY (habit_id, date)
      ) WITHOUT ROWID;`,
      `CREATE TABLE widget_bindings (
        widget_id  INTEGER PRIMARY KEY,
        habit_id   TEXT NOT NULL REFERENCES habits(id) ON DELETE CASCADE
      );`,
    ],
  },
];

export function migrate(db: SQLiteDatabase): void {
  const row = db.getFirstSync<{ user_version: number }>('PRAGMA user_version;');
  const current = row?.user_version ?? 0;
  for (const migration of migrations) {
    if (migration.version <= current) continue;
    db.withTransactionSync(() => {
      for (const sql of migration.statements) db.execSync(sql);
      db.execSync(`PRAGMA user_version = ${migration.version};`);
    });
  }
}
