import Restaurant from '#models/restaurant';
import { restaurantValidator } from '#validators/restaurant';
import RestaurantManagersController from './restaurant_managers_controller.js';
import UsersController from './users_controller.js';
import RestaurantManager from '#models/restaurant_manager';
export default class RestaurantsController {
    userController = new UsersController();
    managerController = new RestaurantManagersController();
    async createRestaurant({ request, response }) {
        const { name, streetNumber, streetName, city, postalCode, country, phone } = await request.validateUsing(restaurantValidator);
        const token = request.header('Authorization');
        var restaurant;
        if (!token) {
            return response.status(400).send({
                error: 'Authorization token is missing',
            });
        }
        const idUser = await this.userController.getIdUserFromToken(token);
        if (!idUser) {
            return response.status(404).send({
                error: 'Invalid or expired token',
            });
        }
        try {
            restaurant = await Restaurant.create({
                name: name,
                streetNumber: streetNumber,
                streetName: streetName,
                city: city,
                postalCode: postalCode,
                country: country,
                phone: phone
            });
        }
        catch (error) {
            return response.status(503).send({
                error: 'DataBase server is out of service, impossible to create restaurant'
            });
        }
        if (idUser && restaurant) {
            await this.managerController.createManager(idUser, restaurant.id_restaurant);
        }
        return restaurant;
    }
    async editRestaurant({ request, params, response }) {
        const token = request.header('Authorization');
        const restaurantId = params.id;
        const data = await request.validateUsing(restaurantValidator);
        if (!token) {
            return response.status(400).send({
                error: 'Authorization token is missing',
            });
        }
        const userId = await this.userController.getIdUserFromToken(token);
        if (!userId) {
            return response.status(404).send({
                error: 'Invalid or expired token',
            });
        }
        const restaurant = await Restaurant.find(restaurantId);
        if (!restaurant) {
            return response.status(404).send({
                error: 'Restaurant not found'
            });
        }
        const restaurantManager = await RestaurantManager.query()
            .where('id_user', userId)
            .andWhere('id_restaurant', restaurantId)
            .first();
        if (!restaurantManager) {
            return response.status(401).send({
                error: 'You are not authorized to access this restaurant',
            });
        }
        try {
            restaurant.merge(data);
            await restaurant.save();
            return restaurant;
        }
        catch (error) {
            return response.status(503).send({
                error: 'DataBase server is out of service, impossible to create restaurant',
            });
        }
    }
    async deleteRestaurant({ request, params, response }) {
        const token = request.header('Authorization');
        const restaurantId = params.id;
        if (!token) {
            return response.status(400).send({
                error: 'Authorization token is missing',
            });
        }
        const userId = await this.userController.getIdUserFromToken(token);
        if (!userId) {
            return response.status(404).send({
                error: 'Invalid or expired token',
            });
        }
        const restaurantManager = await RestaurantManager.query()
            .where('id_user', userId)
            .andWhere('id_restaurant', restaurantId)
            .first();
        if (!restaurantManager) {
            return response.status(401).send({
                error: 'You are not authorized to delete this restaurant',
            });
        }
        const restaurant = await Restaurant.find(restaurantId);
        if (!restaurant) {
            return response.status(404).send({
                error: 'Restaurant not found',
            });
        }
        try {
            await restaurant.delete();
            return response.status(200).send({
                message: 'Restaurant deleted successfully',
            });
        }
        catch (error) {
            return response.status(503).send({
                error: 'Database server is out of service, unable to delete restaurant',
            });
        }
    }
    async getAllMyManagedRestaurant({ request, response }) {
        const token = request.header('Authorization');
        if (!token) {
            return response.status(400).send({
                error: 'Authorization token is missing',
            });
        }
        const uId = await this.userController.getIdUserFromToken(token);
        if (!uId) {
            return response.status(404).send({
                error: 'Unknow user',
            });
        }
        const listManagedRestaurant = await RestaurantManager.query()
            .preload('restaurant')
            .where('id_user', uId)
            .exec();
        return listManagedRestaurant.map(manager => manager.restaurant);
    }
    async getRestaurantById({ request, response }) {
        const id = request.params().id;
        const token = request.header('Authorization');
        if (!token) {
            return response.status(400).send({
                error: 'Authorization token is missing',
            });
        }
        const uId = await this.userController.getIdUserFromToken(token);
        if (!uId) {
            return response.status(404).send({
                error: 'Unknow user',
            });
        }
        const isMyRestaurant = await this.managerController.checkIfMyRestaurant(uId, id);
        if (!isMyRestaurant) {
            return response.status(400).send({
                error: 'Unauthorize to get this restaurant',
            });
        }
        const restaurant = await Restaurant.find(id);
        if (!restaurant) {
            return response.status(404).send({
                error: 'Restaurant not found',
            });
        }
        return restaurant;
    }
    async getAllRestaurant({ request, response }) {
        const limit = request.input('_limit', 10);
        const page = request.input('_page', 1);
        try {
            const restaurant = await Restaurant.query().paginate(page, limit);
            return response.status(200).send(restaurant);
        }
        catch (error) {
            return response.status(503).send({
                error: 'Database server is out of service, impossible to retrieve restaurants',
            });
        }
    }
}
//# sourceMappingURL=restaurants_controller.js.map