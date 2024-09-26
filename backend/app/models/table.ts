import { DateTime } from 'luxon'
// @ts-ignore
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Plan from '#models/plan'

export default class Table extends BaseModel {
  @column({ isPrimary: true })
  declare id_table: number

  @column()
  declare numero: number

  @column()
  declare capacity: number

  @column()
  declare id_plan: number

  @belongsTo(() => Plan)
  declare plan: BelongsTo<typeof Plan>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null
}
