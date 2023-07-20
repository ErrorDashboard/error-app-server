import { config } from 'dotenv';
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const CREDENTIALS = process.env.CREDENTIALS === 'true';
export const SECURE_COOKIE = process.env.SECURE_COOKIE === 'true';
export const { CLIENT_PORT, CLIENT_URL } = process.env;
export const {
  NODE_ENV,
  BASE_URL,
  PORT,
  ACCESS_SECRET_KEY,
  REFRESH_SECRET_KEY,
  LOG_FORMAT,
  LOG_DIR,
  ORIGIN,
} = process.env;
export const { DB_HOST, DB_PORT, DB_DATABASE } = process.env;
export const { GOOGLE_OAUTH2_CLIENT_ID, GOOGLE_OAUTH2_CLIENT_SECRET } =
  process.env;
export const { GITHUB_OAUTH2_CLIENT_ID, GITHUB_OAUTH2_CLIENT_SECRET } =
  process.env;
