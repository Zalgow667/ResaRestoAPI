import vine from '@vinejs/vine'

export const restaurantValidator = vine.compile(
  vine.object({
    name: vine.string().unique(async (db, value) => {
      const match = await db
        .from('restaurants')
        .select('id_restaurant')
        .where('name', value)
        .first()
      return !match
    }),
    phone: vine.string().mobile(),
    streetNumber: vine.string(),
    streetName: vine.string(),
    city: vine.string(),
    postalCode: vine.string(),
    country: vine.string(),
  })
)
