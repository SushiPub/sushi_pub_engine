import '../bootstrap';
import { createDb } from './db';

async function checkDb() {
  const db = createDb();

  try {
    await db.raw('select 1');
    console.log('✅ Database is reachable');
  } catch (err) {
    console.error('\n❌ Database connection failed');
    console.error('➡️ Is Postgres running?');
    console.error('➡️ Check DB_HOST / DB_PORT / DB_NAME');
    console.error('➡️ Try: docker compose up -d\n');
    process.exit(1);
  } finally {
    await db.destroy();
  }
}

checkDb();