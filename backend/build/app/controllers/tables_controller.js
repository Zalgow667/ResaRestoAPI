import { newTableValidator } from '#validators/table';
import RestaurantManagersController from './restaurant_managers_controller.js';
import UsersController from './users_controller.js';
import PlansController from './plans_controller.js';
import Table from '#models/table';
import Plan from '#models/plan';
export default class TablesController {
    restaurantManagersController = new RestaurantManagersController();
    userController = new UsersController();
    plansController = new PlansController();
    async createTable({ request, response }) {
        const { numero, capacity, id_plan } = await request.validateUsing(newTableValidator);
        const token = request.header('Authorization');
        const restaurant = await Plan.find(id_plan);
        var table;
        if (!token) {
            return response.status(400).send({
                error: 'Authorization token is missing',
            });
        }
        if (!restaurant) {
            return response.status(400).send({
                error: 'Restaurant is missing',
            });
        }
        const user_id = await this.userController.getIdUserFromToken(token);
        if (user_id != await this.restaurantManagersController.getUserFromRestaurantId(restaurant.id_restaurant)) {
            return response.status(403).send({
                error: 'You havent the access for this restaurant',
            });
        }
        try {
            table = await Table.create({
                numero: numero,
                capacity: capacity,
                id_plan: id_plan
            });
        }
        catch (error) {
            return response.status(503).send({
                error: 'DataBase server is out of service, impossible to create restaurant'
            });
        }
        return table;
    }
    async editTable({ request, params, response }) {
        const token = request.header('Authorization');
        const data = await request.validateUsing(newTableValidator);
        const plan = await Plan.find(data.id_plan);
        let table;
        if (!plan) {
            return response.status(400).send({
                error: 'Restaurant is missing',
            });
        }
        if (!token) {
            return response.status(400).send({
                error: 'Authorization token is missing',
            });
        }
        const user_id = await this.userController.getIdUserFromToken(token);
        if (user_id != await this.restaurantManagersController.getUserFromRestaurantId(plan.id_restaurant)) {
            return response.status(403).send({
                error: 'You do not have access to this restaurant',
            });
        }
        table = await Table.find(params.id);
        if (!table) {
            return response.status(404).send({
                error: 'Table not found'
            });
        }
        try {
            table.merge(data);
            table.save();
            return response.status(200).send({
                message: 'Table successfully edited',
            });
        }
        catch (error) {
            return response.status(503).send({
                error: 'An error occurred while trying to delete the table',
            });
        }
    }
    async deleteTable({ request, params, response }) {
        const token = request.header('Authorization');
        const { id_plan } = await request.validateUsing(newTableValidator);
        const plan = await Plan.find(id_plan);
        if (!token) {
            return response.status(400).send({
                error: 'Authorization token is missing',
            });
        }
        if (!plan) {
            return response.status(400).send({
                error: 'Restaurant is missing',
            });
        }
        const user_id = await this.userController.getIdUserFromToken(token);
        if (user_id == await this.restaurantManagersController.getUserFromRestaurantId(plan.id_restaurant)) {
            return response.status(403).send({
                error: 'You do not have access to this restaurant',
            });
        }
        const table = await Table.find(params.id);
        if (!table) {
            return response.status(404).send({
                error: 'Table not found',
            });
        }
        try {
            await table.delete();
            return response.status(200).send({
                message: 'Table successfully deleted',
            });
        }
        catch (error) {
            return response.status(503).send({
                error: 'An error occurred while trying to delete the table',
            });
        }
    }
    async getTablesFromPlanId(id_plan) {
        return await Table.query()
            .where('id_plan', id_plan);
    }
}
//# sourceMappingURL=tables_controller.js.map