import RestaurantManager from "#models/restaurant_manager";
export default class RestaurantManagersController {
    async createManager(idUser, idRestaurant) {
        await RestaurantManager.create({
            id_user: idUser,
            id_restaurant: idRestaurant
        });
    }
    async getUserFromRestaurantId(idRestaurant) {
        const restaurantManager = await RestaurantManager.query()
            .where('id_restaurant', idRestaurant)
            .preload('user')
            .first();
        if (!restaurantManager) {
            throw new Error('No manager found for the given restaurant');
        }
        return restaurantManager.id_user;
    }
    async checkIfMyRestaurant(idUser, idRestaurant) {
        try {
            const isPresent = await RestaurantManager
                .query()
                .where('id_restaurant', idRestaurant)
                .andWhere('id_user', idUser)
                .first();
            if (!isPresent) {
                return false;
            }
            return true;
        }
        catch (error) {
            return false;
        }
    }
}
//# sourceMappingURL=restaurant_managers_controller.js.map