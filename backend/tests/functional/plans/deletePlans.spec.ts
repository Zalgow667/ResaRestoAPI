import { test } from '@japa/runner' 

const userPayload = {
    firstName: 'Zalgoat',
    lastName: 'Zgigos',
    email: 'zalgoat.zgigos@gmail.com',
    password: 'P@ssword1',
}
  
const restaurantPayload = {
    name: 's',
    streetNumber: 'Place',
    streetName: 'du prout',
    city: 'Grenoble',
    postalCode: '75001',
    country: 'France',
    phone: '0666666611',
}
  
var token: String
var restaurantId: String
var planId: String

test.group('deletePlans', () => {
    test('delete plan with invalid token', async ({ client, assert }) => { 
        const responseUser = await client.post('http://api.zalgow.xyz/api/users/register').json(userPayload)
        token = responseUser.body().tokenUser.hash
        
        const responseRestaurant = await client
            .post('http://api.zalgow.xyz/api/restaurants')
            .json(restaurantPayload)
            .header('Authorization', `Bearer ${token}`)
        
        assert.equal(responseRestaurant.body().name, restaurantPayload.name)
        assert.equal(responseRestaurant.body().streetNumber, restaurantPayload.streetNumber)
        assert.equal(responseRestaurant.body().streetName, restaurantPayload.streetName)
        assert.equal(responseRestaurant.body().city, restaurantPayload.city)
        assert.equal(responseRestaurant.body().postalCode, restaurantPayload.postalCode)
        assert.equal(responseRestaurant.body().country, restaurantPayload.country)
        assert.equal(responseRestaurant.body().phone, restaurantPayload.phone)

        restaurantId = responseRestaurant.body().idRestaurant

        const planPayload = {
            nom: '4ème étage',
            idRestaurant: restaurantId.toString()
        }

        const responseCreatePlan = await client
            .post(`http://api.zalgow.xyz/api/plans/${restaurantId}`)
            .json(planPayload)
            .header('Authorization', `Bearer ${token}`)

        assert.equal(responseCreatePlan.body().nom, planPayload.nom)
        assert.equal(responseCreatePlan.body().idRestaurant, planPayload.idRestaurant)

        planId = responseCreatePlan.body().idPlan

        const responseDeletePlan = await client
            .delete(`http://api.zalgow.xyz/api/plans/${planId}`)
            .header('Authorization', `aaaa`)

        responseDeletePlan.assertStatus(403)
        assert.deepEqual(responseDeletePlan.body(), { error: 'You havent the access for this restaurant' })
    })

    test('delete plan without token', async ({ client, assert }) => { 
        const responseDeletePlan = await client
            .delete(`http://api.zalgow.xyz/api/plans/${planId}`)
            
        responseDeletePlan.assertStatus(400)
        assert.deepEqual(responseDeletePlan.body(), { error: 'Authorization token is missing' })
    })

    test('delete plan with valid token', async ({ client, assert }) => { 
        const responseDeletePlan = await client
            .delete(`http://api.zalgow.xyz/api/plans/${planId}`)
            .header('Authorization', `Bearer ${token}`)
            
        responseDeletePlan.assertStatus(200)
        assert.deepEqual(responseDeletePlan.body(), { message: 'Plan deleted successfully' })
    })
})
