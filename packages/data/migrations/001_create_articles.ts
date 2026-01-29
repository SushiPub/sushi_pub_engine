import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('articles', (t) => {
    t.uuid('id').primary();
    t.text('title').notNullable();
    t.text('slug').notNullable().unique();
    t.text('body').notNullable();
    t.text('status').notNullable();
    t.timestamp('created_at').notNullable();
    t.timestamp('updated_at').notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('articles');
}