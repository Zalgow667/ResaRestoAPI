// import type { HttpContext } from '@adonisjs/core/http'

import RestaurantManager from "#models/restaurant_manager"

export default class RestaurantManagersController {
    async createManager(idUser: number, idRestaurant: number){
        await RestaurantManager.create({
            id_user: idUser,
            id_restaurant: idRestaurant
        })
    }

    async getUserFromRestaurantId(idRestaurant: number): Promise<number | null> {
        const restaurantManager = await RestaurantManager.query()
          .where('id_restaurant', idRestaurant)
          .preload('user') 
          .first()
      
        if (!restaurantManager) {
          throw new Error('No manager found for the given restaurant')
        }
        
        return restaurantManager.id_user
    }
    
    async checkIfMyRestaurant(idUser: number, idRestaurant: number): Promise<boolean | null>{
        try{
            const isPresent = await RestaurantManager
                .query()
                .where('id_restaurant', idRestaurant)
                .andWhere('id_user', idUser)
                .first()
            if(!isPresent){
                return false
            }
            return true
        }catch(error){
            return false
        }
    }
}