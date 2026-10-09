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
        CREATE INDEX IF NOT EXISTS pageviews_ts_idx ON pageviews (ts);
        ALTER TABLE pageviews ADD COLUMN IF NOT EXISTS is_new BOOLEAN NOT NULL DEFAULT false;
        CREATE TABLE IF NOT EXISTS suggestions (
          id BIGSERIAL PRIMARY KEY,
          ts TIMESTAMPTZ NOT NULL DEFAULT now(),
          name TEXT,
          idea TEXT NOT NULL,
          source TEXT,
          vid TEXT
        );
        CREATE TABLE IF NOT EXISTS leads (
          id BIGSERIAL PRIMARY KEY,
          ts TIMESTAMPTZ NOT NULL DEFAULT now(),
          product TEXT NOT NULL,
          name TEXT NOT NULL,
          phone TEXT,
          email TEXT,
          business TEXT,
          details TEXT,
          message TEXT,
          vid TEXT
        );
        ALTER TABLE leads ADD COLUMN IF NOT EXISTS alert_error TEXT;
        CREATE TABLE IF NOT EXISTS short_links (
          id BIGSERIAL PRIMARY KEY,
          alias TEXT NOT NULL UNIQUE,
          url TEXT NOT NULL,
          title TEXT,
          key_hash TEXT NOT NULL,
          created TIMESTAMPTZ NOT NULL DEFAULT now(),
          expires TIMESTAMPTZ,
          clicks INT NOT NULL DEFAULT 0,
          disabled BOOLEAN NOT NULL DEFAULT false,
          vid TEXT
        );
        ALTER TABLE short_links ADD COLUMN IF NOT EXISTS page JSONB;
        CREATE TABLE IF NOT EXISTS short_clicks (
          id BIGSERIAL PRIMARY KEY,
          link_id BIGINT NOT NULL,
          ts TIMESTAMPTZ NOT NULL DEFAULT now(),
          source TEXT, device TEXT, country TEXT
        );
        CREATE INDEX IF NOT EXISTS short_clicks_link_idx ON short_clicks (link_id, ts);
        CREATE TABLE IF NOT EXISTS short_reports (
          link_id BIGINT NOT NULL,
          vid TEXT NOT NULL,
          ts TIMESTAMPTZ NOT NULL DEFAULT now(),
          PRIMARY KEY (link_id, vid)
        );`
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
