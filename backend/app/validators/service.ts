import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

// Fonction pour vérifier si une date est au format ISO 8601
const isISO8601 = (value: any) => {
  return DateTime.fromISO(value).isValid
}

export const serviceValidator = vine.compile(
  vine.object({
    day: vine.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']),
    name: vine.string(),
  })
)
