import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import Booking from './booking.js'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import RestaurantManager from './restaurant_manager.js'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import { AccessToken } from '@adonisjs/auth/access_tokens'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  currentAccessToken?: AccessToken

  @column({ isPrimary: true })
  declare id_user: number

  @column()
  declare lastName: string

  @column()
  declare firstName: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare role: 'manager' | 'client'

  @hasMany(() => Booking)
  declare bookings: HasMany<typeof Booking>

  @hasMany(() => RestaurantManager)
  declare  managedRestaurants: HasMany<typeof RestaurantManager>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })  
  declare updatedAt: DateTime | null

  static accessTokens = DbAccessTokensProvider.forModel(User, {
    expiresIn: '30 days'
  })
}
