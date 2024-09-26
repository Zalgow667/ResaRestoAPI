import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

export const serviceValidator = vine.compile(
  vine.object({
    day: vine.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
    name: vine.string(),
  })
)
