import UsersController from './users_controller.js';
import RestaurantManagersController from './restaurant_managers_controller.js';
import Plan from '#models/plan';
export default class PlansController {
    userController = new UsersController();
    restaurantManagersController = new RestaurantManagersController();
    async createPlan({ request, response }) {
        const { nom } = request.only(['nom']);
        const restaurantId = request.params().restaurant_id;
        const token = request.header('Authorization');
        if (!token) {
            return response.status(400).send({
                error: 'Authorization token is missing',
            });
        }
        const user_id = await this.userController.getIdUserFromToken(token);
        if (!restaurantId) {
            return response.status(400).send({
                error: 'Restaurant id is missing',
            });
        }
        if (!nom) {
            return response.status(400).send({
                error: 'Plan name is missing',
            });
        }
        const existingPlan = await Plan.query()
            .where('id_restaurant', restaurantId)
            .andWhere('nom', nom)
            .first();
        if (existingPlan) {
            return response.status(409).send({
                error: 'A plan with the same name already exists for this restaurant',
            });
        }
        if (user_id != await this.restaurantManagersController.getUserFromRestaurantId(restaurantId)) {
            return response.status(403).send({
                error: 'You havent the access for this restaurant',
            });
        }
        try {
            const newPlan = await Plan.create({
                nom: nom,
                id_restaurant: restaurantId,
            });
            return response.status(200).send(newPlan);
        }
        catch (error) {
            return response.status(503).send({
                error: 'DataBase server is out of service, impossible to create restaurant'
            });
        }
    }
    async editPlan({ request, params, response }) {
        const { nom } = request.only(['nom']);
        const planId = params.plan_id;
        const plan = await Plan.find(planId);
        const token = request.header('Authorization');
        if (!token) {
            return response.status(400).send({
                error: 'Authorization token is missing',
            });
        }
        if (!planId) {
            return response.status(400).send({
                error: 'Plan id is missing',
            });
        }
        if (!plan) {
            return response.status(404).send({
                error: 'Plan not found',
            });
        }
        if (!nom) {
            return response.status(400).send({
                error: 'Plan name is missing',
            });
        }
        const user_id = await this.userController.getIdUserFromToken(token);
        const existingPlan = await Plan.query()
            .where('id_restaurant', plan.id_restaurant)
            .andWhere('nom', nom)
            .andWhereNot('id_plan', planId)
            .first();
        if (existingPlan) {
            return response.status(409).send({
                error: 'A plan with the same name already exists for this restaurant',
            });
        }
        plan.nom = nom;
        if (user_id != await this.restaurantManagersController.getUserFromRestaurantId(plan.id_restaurant)) {
            return response.status(403).send({
                error: 'You havent the access for this restaurant',
            });
        }
        try {
            await plan.save();
            return response.status(200).send(plan);
        }
        catch (error) {
            return response.status(503).send({
                error: 'Database server is out of service, unable to edit plan',
            });
        }
    }
    async deletePlan({ request, params, response }) {
        const planId = params.plan_id;
        const token = request.header('Authorization');
        const plan = await Plan.find(planId);
        if (!token) {
            return response.status(400).send({
                error: 'Authorization token is missing',
            });
        }
        if (!planId) {
            return response.status(400).send({
                error: 'Plan id is missing',
            });
        }
        if (!plan) {
            return response.status(404).send({
                error: 'Plan not found',
            });
        }
        const user_id = await this.userController.getIdUserFromToken(token);
        if (user_id != await this.restaurantManagersController.getUserFromRestaurantId(plan.id_restaurant)) {
            return response.status(403).send({
                error: 'You havent the access for this restaurant',
            });
        }
        try {
            await plan.delete();
            return response.status(200).send({
                message: 'Plan deleted successfully',
            });
        }
        catch (error) {
            return response.status(503).send({
                error: 'Database server is out of service, unable to delete plan',
            });
        }
    }
    async getPlanFromRestaurantId({ request, response }) {
        const id = request.params().id;
        if (!id) {
            return response.status(400).send({
                error: 'id is missing',
            });
        }
        try {
            const plans = await Plan.query().where('id_restaurant', id).exec();
            if (!plans) {
                return response.status(404).send({
                    error: 'Plan not found',
                });
            }
            return response.status(200).send(plans);
        }
        catch (error) {
            return response.status(503).send({
                error: 'Database server is out of service, unable to delete plan',
            });
        }
    }
}
//# sourceMappingURL=plans_controller.js.map