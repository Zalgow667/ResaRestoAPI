import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Table from '#models/table'

export default class Booking extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column.date()
  declare start: DateTime

  @column.date()
  declare end: DateTime

  @column()
  declare id_user: number

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column()
  declare id_table: number

  @belongsTo(() => Table)
  declare table: BelongsTo<typeof Table>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}
