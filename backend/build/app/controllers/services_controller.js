import UsersController from './users_controller.js';
import { serviceValidator } from '#validators/service';
import Service from '#models/service';
import RestaurantManagersController from './restaurant_managers_controller.js';
import { DateTime } from 'luxon';
export default class ServicesController {
    userController = new UsersController();
    managerController = new RestaurantManagersController();
    async createService({ request, response, params }) {
        const token = request.header('Authorization');
        if (!token) {
            return response.status(400).send({
                error: 'Token not received',
            });
        }
        const restaurantId = params.id;
        if (!restaurantId) {
            return response.status(400).send({
                error: 'Not a valid restaurant id'
            });
        }
        const userId = await this.userController.getIdUserFromToken(token);
        if (!userId) {
            return response.status(400).send({
                error: 'Invalid token',
            });
        }
        const isHisResturant = await this.managerController.checkIfMyRestaurant(userId, restaurantId);
        if (!isHisResturant) {
            return response.status(400).send({
                error: 'Not His restaurant',
            });
        }
        const { day, name } = await request.validateUsing(serviceValidator);
        const start = request.body().start;
        const end = request.body().end;
        const isValidStart = DateTime.fromISO(start).isValid;
        const isValidEnd = DateTime.fromISO(end).isValid;
        if (!isValidEnd || !isValidStart) {
            return response.status(400).send({
                error: 'Invalid date format. Start and end must be valid ISO 8601 dates.',
            });
        }
        if (start > end) {
            return response.status(400).send({
                error: 'Impossible start / end dates',
            });
        }
        try {
            const service = await Service.create({
                id_restaurant: restaurantId,
                start: start,
                end: end,
                day: day,
                name: name,
            });
            return service;
        }
        catch (error) {
            return response.status(400).send({
                error: 'Unable to create service',
            });
        }
    }
    async editService({ request, params, response }) {
        const token = request.header('Authorization');
        const restaurantId = params.id;
        if (!token) {
            return response.status(400).send({
                error: 'Authorization token is missing'
            });
        }
        if (!restaurantId) {
            return response.status(400).send({
                error: 'Not a valid restaurant id'
            });
        }
        if (!token) {
            return response.status(400).send({
                error: 'Authorization token is missing',
            });
        }
        if (!restaurantId) {
            return response.status(400).send({
                error: 'Not a valid restaurant',
            });
        }
        const serviceId = params.id_service;
        if (!serviceId) {
            return response.status(400).send({
                error: 'Not a valid service',
            });
        }
        const userId = await this.userController.getIdUserFromToken(token);
        if (!userId) {
            return response.status(400).send({
                error: 'Not a valid token',
            });
        }
        const { day, name } = await request.validateUsing(serviceValidator);
        const start = request.body().start;
        const end = request.body().end;
        const isValidStart = DateTime.fromISO(start).isValid;
        const isValidEnd = DateTime.fromISO(end).isValid;
        if (!isValidEnd || !isValidStart) {
            return response.status(400).send({
                error: 'Invalid date format. Start and end must be valid ISO 8601 dates.',
            });
        }
        if (start > end) {
            return response.status(400).send({
                error: 'Impossible start / end dates',
            });
        }
        const isHisResturant = await this.managerController.checkIfMyRestaurant(userId, restaurantId);
        if (!isHisResturant) {
            return response.status(400).send({
                error: 'Not His restaurant',
            });
        }
        const service = await Service.query()
            .where('id_restaurant', restaurantId)
            .andWhere('id_service', serviceId)
            .first();
        if (!service) {
            return response.status(400).send({
                error: 'Service not found',
            });
        }
        try {
            service.merge({
                start: start,
                end: end,
                day: day,
                name: name,
            });
            await service.save();
            return service;
        }
        catch (error) {
            return response.status(400).send({
                error: 'Can not edit service',
            });
        }
    }
    async deleteService({ request, params, response }) {
        const token = request.header('Authorization');
        if (!token) {
            return response.status(400).send({
                error: 'Authorization token is missing',
            });
        }
        const restaurantId = params.id;
        if (!restaurantId) {
            return response.status(400).send({
                error: 'Not a valid restaurant',
            });
        }
        const serviceId = params.id_service;
        if (!serviceId) {
            return response.status(400).send({
                error: 'Not a valid service',
            });
        }
        const userId = await this.userController.getIdUserFromToken(token);
        if (!userId) {
            return response.status(400).send({
                error: 'Invalid token',
            });
        }
        const isHisResturant = await this.managerController.checkIfMyRestaurant(userId, restaurantId);
        if (!isHisResturant) {
            return response.status(400).send({
                error: 'Not authorized to access this restaurant',
            });
        }
        const service = await Service.query()
            .where('id_restaurant', restaurantId)
            .andWhere('id_service', serviceId)
            .first();
        if (!service) {
            return response.status(404).send({
                error: 'Service not found',
            });
        }
        try {
            await service.delete();
            return response.status(200).send({
                message: 'Service deleted successfully',
            });
        }
        catch (error) {
            return response.status(503).send({
                error: 'Error occurred during service deletion',
            });
        }
    }
    async getMyServices({ request, params, response }) {
        const token = request.header('Authorization');
        if (!token) {
            return response.status(400).send({
                error: 'Token not received',
            });
        }
        const restaurantId = params.id;
        if (!restaurantId) {
            return response.status(400).send({
                error: 'Unknown restaurant',
            });
        }
        const userId = await new UsersController().getIdUserFromToken(token);
        if (!userId) {
            return response.status(400).send({
                error: 'Invalid token',
            });
        }
        const isHisResturant = await this.managerController.checkIfMyRestaurant(userId, restaurantId);
        if (!isHisResturant) {
            return response.status(400).send({
                error: 'Not His restaurant',
            });
        }
        try {
            const listMyServices = await Service.query()
                .preload('restaurant')
                .where('id_restaurant', restaurantId)
                .exec();
            return listMyServices.map((service) => service);
        }
        catch (error) {
            return response.status(503).send({
                error: 'DataBase server is out of service, impossible to create restaurant',
            });
        }
    }
}
//# sourceMappingURL=services_controller.js.map