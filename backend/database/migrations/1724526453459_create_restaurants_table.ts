import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'restaurants'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id_restaurant').primary()

      table.string('name').notNullable()
      table.string('street_number').notNullable() 
      table.string('street_name').notNullable() 
      table.string('city').notNullable()
      table.string('postal_code').notNullable() 
      table.string('country').notNullable()
      table.string('phone').notNullable()

      table.timestamp('created_at').notNullable()
      table.timestamp('updated_at').nullable()
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
