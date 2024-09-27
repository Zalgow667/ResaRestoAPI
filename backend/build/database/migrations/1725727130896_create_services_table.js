import { BaseSchema } from '@adonisjs/lucid/schema';
export default class extends BaseSchema {
    tableName = 'services';
    async up() {
        this.schema.createTable(this.tableName, (table) => {
            table.increments('id_service').primary();
            table
                .integer('id_restaurant')
                .unsigned()
                .references('id_restaurant')
                .inTable('restaurants')
                .onDelete('CASCADE');
            table.time('start').notNullable();
            table.time('end').notNullable();
            table
                .enum('day', ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])
                .notNullable();
            table.string('name').notNullable();
            table.timestamp('created_at').notNullable();
            table.timestamp('updated_at').nullable();
        });
    }
    async down() {
        this.schema.dropTable(this.tableName);
    }
}
//# sourceMappingURL=1725727130896_create_services_table.js.map