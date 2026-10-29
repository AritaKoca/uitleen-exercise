import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("students", function (table) {
    table.increments();
    // a text column, so a number like "01234" keeps its leading zero
    table.string("studentNumber", 5).notNullable().unique();
    table.string("firstName", 100).notNullable();
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("students");
}
