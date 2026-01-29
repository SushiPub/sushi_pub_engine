import path from 'path';
import dotenv from 'dotenv';

const envPath = path.resolve(__dirname, '../../../.env');

dotenv.config({ path: envPath, quiet: true });

if (!process.env.DB_NAME) {
  throw new Error('❌ DB_NAME is not set');
}