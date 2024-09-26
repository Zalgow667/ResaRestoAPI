import { DateTime } from 'luxon'
// @ts-ignore
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import Plan from '#models/plan'
import RestaurantManager from '#models/restaurant_manager'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import Service from './service.js'

export default class Restaurant extends BaseModel {
  @column({ isPrimary: true })
  declare id_restaurant: number;

  @column()
  declare name: string;

  @column()
  declare streetNumber: string;

  @column()
  declare streetName: string;

  @column()
  declare city: string;

  @column()
  declare postalCode: string;

  @column()
  declare country: string;

  @column()
  declare phone: string;

  @hasMany(() => Plan)
  declare plans: HasMany<typeof Plan>;

  @hasMany(() => RestaurantManager)
  declare managers: HasMany<typeof RestaurantManager>;

  @hasMany(() => Service)
  declare services: HasMany<typeof Service>;

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null;
}
