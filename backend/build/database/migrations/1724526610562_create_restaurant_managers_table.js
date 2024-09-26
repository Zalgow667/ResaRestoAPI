import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'restaurant_managers';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.integer('id_user').unsigned().references('id_user').inTable('users').onDelete('CASCADE');
            table.integer('id_restaurant').unsigned().references('id_restaurant').inTable('restaurants').onDelete('CASCADE');
            table.primary(['id_user', 'id_restaurant']);
            table.timestamp('created_at').notNullable();
            table.timestamp('updated_at').nullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1724526610562_create_restaurant_managers_table.js.map