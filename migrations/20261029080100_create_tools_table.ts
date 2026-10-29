import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("tools", function (table) {
    table.increments();
    table.string("name", 100).notNullable();
    table.string("description", 500);
    // empty (null) = the tool is available, otherwise the id of the student who has it
    table.integer("lentToStudentId").unsigned().references("id").inTable("students");
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("tools");
}
