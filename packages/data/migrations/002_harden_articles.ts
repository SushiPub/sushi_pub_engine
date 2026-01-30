import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  // 1️⃣ Enforce NOT NULL where appropriate
  await knex.schema.alterTable('articles', (t) => {
    t.text('title').notNullable().alter();
    t.text('slug').notNullable().alter();
    t.text('body').notNullable().alter();
    t.text('status').notNullable().alter();
    t.timestamp('created_at').notNullable().alter();
    t.timestamp('updated_at').notNullable().alter();
  });

  // 2️⃣ Indexes (performance + integrity)
  await knex.schema.alterTable('articles', (t) => {
    t.unique(['slug'], 'articles_slug_unique');
    t.index(['status'], 'articles_status_idx');
    t.index(['created_at'], 'articles_created_at_idx');
  });
}
//knex migrate:rollback
export async function down(knex: Knex): Promise<void> {
  // Reverse indexes first
  await knex.schema.alterTable('articles', (t) => {
    t.dropIndex(['created_at'], 'articles_created_at_idx');
    t.dropIndex(['status'], 'articles_status_idx');
    t.dropUnique(['slug'], 'articles_slug_unique');
  });

  // Loosen constraints (safe for rollback)
  await knex.schema.alterTable('articles', (t) => {
    t.text('title').nullable().alter();
    t.text('slug').nullable().alter();
    t.text('body').nullable().alter();
    t.text('status').nullable().alter();
    t.timestamp('created_at').nullable().alter();
    t.timestamp('updated_at').nullable().alter();
  });
}