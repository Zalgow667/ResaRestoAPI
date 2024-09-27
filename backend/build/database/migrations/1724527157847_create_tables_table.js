import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'tables';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id_table').primary();
            table.integer('numero').notNullable();
            table.integer('capacity').notNullable();
            table.integer('id_plan').unsigned().references('id_plan').inTable('plans').onDelete('CASCADE');
            table.timestamp('created_at').notNullable();
            table.timestamp('updated_at').nullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1724527157847_create_tables_table.js.map