import postgres from 'postgres';

let sql;

export function getDb() {
  if (!sql) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('DATABASE_URL is not set');
    }
    sql = postgres(connectionString);
  }
  return sql;
}
