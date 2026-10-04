import pg from "pg";

// Vercel's Neon integration may add a custom prefix (e.g. STORAGE_DATABASE_URL), so accept those too
const url = () =>
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env[Object.keys(process.env).find((k) => /(^|_)(DATABASE|POSTGRES)_URL$/.test(k)) || ""];

export const dbConfigured = () => !!url();

const g = globalThis;

function pool() {
  if (!g.__gtPool) g.__gtPool = new pg.Pool({ connectionString: url(), max: 3, idleTimeoutMillis: 10000 });
  return g.__gtPool;
}

export async function ensureSchema() {
  if (!g.__gtSchema) {
    g.__gtSchema = pool()
      .query(
        `CREATE TABLE IF NOT EXISTS pageviews (
          id BIGSERIAL PRIMARY KEY,
          ts TIMESTAMPTZ NOT NULL DEFAULT now(),
          path TEXT NOT NULL,
          source TEXT NOT NULL,
          medium TEXT NOT NULL,
          ref_host TEXT,
          country TEXT, region TEXT, city TEXT,
          device TEXT, browser TEXT, os TEXT,
          vid TEXT NOT NULL
        );
        CREATE INDEX IF NOT EXISTS pageviews_ts_idx ON pageviews (ts);`
      )
      .catch((e) => {
        g.__gtSchema = null;
        throw e;
      });
  }
  return g.__gtSchema;
}

export async function q(text, params) {
  await ensureSchema();
  return (await pool().query(text, params)).rows;
}
