import type { Knex } from 'knex';
import './src/bootstrap';

// ⚠️ IMPORTANT:
// This file is used ONLY by CLI & migrations
// Env MUST already be loaded before this runs

const config: Knex.Config = {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    directory: './migrations',
    extension: 'ts',
  },
};

export default config;