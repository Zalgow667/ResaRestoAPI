import { test } from '@japa/runner'

const userPayload = {
    firstName: 'Aquiry',
    lastName: 'Le kiri',
    email: 'aquiry.kiri@gmail.com',
    password: 'P@ssword1',
}

const restaurantPayload = {
    name: 'editPlan',
    streetNumber: 'Place',
    streetName: 'du prout',
    city: 'Caen',
    postalCode: '75001',
    country: 'France',
    phone: '0666666611',
}

var token: String
var restaurantId: String
var planId: String

test.group('editPlans', () => {
    test('edit plan with invalid token', async ({ client, assert }) => {
        const responseUser = await client.post('http://localhost:3333/api/users/register').json(userPayload)
        token = responseUser.body().tokenUser.hash

        const responseRestaurant = await client
            .post('http://localhost:3333/api/restaurants')
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
            nom: '5ème étage',
            idRestaurant: restaurantId.toString(),
        }

        const responseCreatePlan = await client
            .post(`http://localhost:3333/api/plans/${restaurantId}`)
            .json(planPayload)
            .header('Authorization', `Bearer ${token}`)

        planId = responseCreatePlan.body().idPlan

        const editPayload = {
            nom: '5ème étage - modifié',
        }

        const responseEditPlan = await client
            .put(`http://localhost:3333/api/plans/${planId}`)
            .json(editPayload)
            .header('Authorization', `InvalidToken`)

        responseEditPlan.assertStatus(403)
        assert.deepEqual(responseEditPlan.body(), { error: 'You havent the access for this restaurant' })
    })

    test('edit plan without token', async ({ client, assert }) => {
        const editPayload = {
            nom: '5ème étage - modifié',
        }

        const responseEditPlan = await client
            .put(`http://localhost:3333/api/plans/${planId}`)
            .json(editPayload)

        responseEditPlan.assertStatus(400)
        assert.deepEqual(responseEditPlan.body(), { error: 'Authorization token is missing' })
    })

    test('edit plan with invalid plan id', async ({ client, assert }) => {
        const editPayload = {
            nom: '5ème étage - modifié',
        }

        const responseEditPlan = await client
            .put(`http://localhost:3333/api/plans/${planId + "213123213"}`)
            .json(editPayload)
            .header('Authorization', `Bearer ${token}`)

        responseEditPlan.assertStatus(404)
        assert.deepEqual(responseEditPlan.body(), { error: 'Plan not found' })
    })

    test('edit plan with valid token', async ({ client, assert }) => {
        const editPayload = {
            nom: '5ème étage - modifié',
        }

        const responseEditPlan = await client
            .put(`http://localhost:3333/api/plans/${planId}`)
            .json(editPayload)
            .header('Authorization', `Bearer ${token}`)

        responseEditPlan.assertStatus(200)
        assert.equal(responseEditPlan.body().nom, editPayload.nom)
    })
})
