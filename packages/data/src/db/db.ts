import knex, { Knex } from 'knex';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`❌ Missing or invalid env var: ${name}`);
  }
  return value;
}


//function since we should wait env to be ready loaded
export function createDb(): Knex {  
  // 🔒 SAFETY GUARDS (runtime, not import-time)
  if (process.env.NODE_ENV === 'production') {
    throw new Error('❌ Data package must not run in production');
  }

  const dbName = requireEnv('DB_NAME');
  
  if (!dbName.includes('test')) {
    throw new Error(
      `❌ Refusing to connect to a non-test database: ${dbName}`
    );
  }

  return knex({
    client: 'pg',
    connection: {
      host: requireEnv('DB_HOST'),
      port: Number(requireEnv('DB_PORT')),
      user: requireEnv('DB_USER'),
      password: requireEnv('DB_PASSWORD'),
      database: dbName,
    },
  });
}