import vine from '@vinejs/vine'

export const bookingValidator = vine.compile(
    vine.object({
        booking_date: vine.date(), 
        start: vine.date(), 
        id_user: vine.number(), 
        id_table: vine.number()
    })
)