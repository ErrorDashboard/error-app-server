import { DB_HOST, DB_PORT, DB_DATABASE } from '@config';

export const dbConnectionString = `mongodb://${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;
export const dbOptions = {};
