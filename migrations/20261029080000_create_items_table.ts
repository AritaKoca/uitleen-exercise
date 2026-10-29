import type { Knex } from "knex";

// TOPIC: baseline table. Replace or extend it for your own topic.
// Never change a migration that already ran: add a new one instead.

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("items", function (table) {
    table.increments();
    table.string("name", 100).notNullable();
    table.string("description", 500);
    table.boolean("archived").defaultTo(false);
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("items");
}
