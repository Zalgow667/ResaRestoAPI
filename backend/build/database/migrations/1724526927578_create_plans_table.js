import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'plans';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id_plan').primary();
            table.string('nom').notNullable();
            table.integer('id_restaurant').unsigned().references('id_restaurant').inTable('restaurants').onDelete('CASCADE');
            table.timestamp('created_at').notNullable();
            table.timestamp('updated_at').nullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1724526927578_create_plans_table.js.map