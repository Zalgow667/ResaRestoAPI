import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import Restaurant from './restaurant.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { TimeLike } from 'node:fs'

export default class Service extends BaseModel {
  @column({ isPrimary: true })
  declare id_service: number

  @column()
  declare id_restaurant: number
  @belongsTo(() => Restaurant, {
    foreignKey: 'id_restaurant',
  })
  declare restaurant: BelongsTo<typeof Restaurant>

  @column()
  declare start: TimeLike

  @column()
  declare end: DateTime

  @column()
  declare name: string

  @column()
  declare day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
