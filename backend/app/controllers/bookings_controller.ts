import type { HttpContext } from '@adonisjs/core/http'
import { bookingValidator } from '#validators/booking'
import { DateTime } from 'luxon'
import UsersController from './users_controller.js'
import Booking from '#models/booking'
import Table from '#models/table'
import Plan from '#models/plan'
import Service from '#models/service'

export default class BookingsController {

    userController = new UsersController()

    async createBooking({ response, request }: HttpContext){
        const { start, id_user, id_table } = await request.validateUsing(bookingValidator)
        const token = request.header('Authorization')
        var booking : Booking
        let table = await Table.find(id_table)

        if (!token) {
            return response.status(400).send({
                error: 'Authorization token is missing',
            })
        }

        const user_id = await this.userController.getIdUserFromToken(token)

        if (!user_id) {
            return response.status(400).send({
                error: 'User doesnt exist',
            })
        }

        if (user_id != id_user) {
            return response.status(403).send({
                error: 'User not authorized',
            })
        }

        if (!table) {
            return response.status(400).send({
                error: 'Table doesnt exist',
            })
        }

        let plan = await Plan.find(table.id_plan)

        if (!plan) {
            return response.status(404).send({
                error: 'Plan not found',
            })
        }
        
        let service = await Service.query()
            .where('id_restaurant', plan.id_restaurant)
            .first()
        
        if (!service) {
            return response.status(404).send({
                error: 'Service not found',
            })
        }

        try {
            booking = await Booking.create({
                start: DateTime.fromJSDate(new Date(start)),
                end: DateTime.fromJSDate(new Date(service.end)), 
                id_user: id_table,
                id_table: id_table
            })

            return booking
        } catch (error) {
            return response.status(503).send({
                error: 'DataBase server is out of service, impossible to create restaurant'
            })
        }
    }
}
