/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  await knex.schema.createTable('boxes', (table) => {
    table.increments('id').primary();
    table.string('name', 50).notNullable().unique();
    table.string('content', 200).notNullable();
    table.string('solution', 64).notNullable();
    table.integer('difficulty').unsigned().checkBetween([1, 5]);
    table.specificType('tags', 'TEXT[]');
    table.timestamps(true, true);
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  await knex.schema.dropTableIfExists('boxes');
}