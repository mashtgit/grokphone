import postgres from 'postgres';

let sql;

export function getDb() {
  if (!sql) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      // ponytail: no DB env = return null, caller handles. Add check on startup when production.
      return null;
    }
    sql = postgres(connectionString);
  }
  return sql;
}
