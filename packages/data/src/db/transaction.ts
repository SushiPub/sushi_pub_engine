/**
 * Executes a given asynchronous function within a database transaction.
 *
 * This utility ensures that all database operations performed within the provided function
 * are executed in a single transaction. If the function resolves successfully, the transaction
 * is committed; if it throws an error, the transaction is rolled back.
 *
 * @typeParam T - The return type of the function executed within the transaction.
 * @param db - The Knex instance used to initiate the transaction.
 * @param fn - An asynchronous function that receives the transaction object and performs database operations.
 * @returns A promise that resolves with the result of the provided function.
 */
import { Knex } from 'knex';
/// Execute a function within a database transaction
export async function withTransaction<T>(
  db: Knex,
  fn: (trx: Knex.Transaction) => Promise<T>
): Promise<T> {
  return db.transaction(async (trx) => {
    return fn(trx);
  });
}