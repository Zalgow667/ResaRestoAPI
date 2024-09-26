import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bookings'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_booking').primary()
      table.date('booking_date').notNullable()
      table.time('start').notNullable()
      table.time('end').notNullable()

      table.integer('id_user').unsigned().references('id_user').inTable('users').onDelete('CASCADE')
      table.integer('id_table').unsigned().references('id_table').inTable('tables').onDelete('CASCADE')

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}