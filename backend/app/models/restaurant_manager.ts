import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Restaurant from '#models/restaurant'

export default class RestaurantManager extends BaseModel {
  @column({ isPrimary: true })
  declare id_user: number

  @column({ isPrimary: true })
  declare id_restaurant: number

  @belongsTo(() => User, {
    foreignKey: 'id_user'
  })
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Restaurant, {
    foreignKey: 'id_restaurant'
  })
  declare restaurant: BelongsTo<typeof Restaurant>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
