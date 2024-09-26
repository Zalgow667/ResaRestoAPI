import { test } from '@japa/runner'

const userPayload = {
  firstName: 'Zalgow',
  lastName: 'Michelin',
  email: 'zalgow.michelin@gmail.com',
  password: 'P@ssword1',
}

const restaurantPayload = {
  name: 'Le Mangeur',
  streetNumber: '10',
  streetName: 'rue de la marmelade',
  city: 'Lyon',
  postalCode: '75001',
  country: 'France',
  phone: '0600000001',
}

var token: String
var restaurantId: String

test.group('createPlans', () => {
  test('create plan with invalid token', async ({ client, assert }) => {
    const responseUser = await client.post('http://api.zalgow.link:3333/api/users/register').json(userPayload)
    token = responseUser.body().tokenUser.hash

    const responseRestaurant = await client
      .post('http://api.zalgow.link:3333/api/restaurants')
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
      nom: '2ème étage',
      idRestaurant: restaurantId.toString()
    }

    const responsePlan = await client
      .post(`http://api.zalgow.link:3333/api/plans/${restaurantId}`)
      .json(planPayload)
      .header('Authorization', `aaaa`)

    responsePlan.assertStatus(403)
    assert.deepEqual(responsePlan.body(), { error: 'You havent the access for this restaurant' })
  })

  test('create plan without token', async ({ client, assert }) => {
    const planPayload = {
      nom: '3ème étage',
      idRestaurant: restaurantId.toString()
    }

    const responsePlan = await client
      .post(`http://api.zalgow.link:3333/api/plans/${restaurantId}`)
      .json(planPayload)

    responsePlan.assertStatus(400)
    assert.deepEqual(responsePlan.body(), { error: 'Authorization token is missing' })
  })

  test('create plan with valid token', async ({ client, assert }) => {
    const planPayload = {
      nom: '1er étage',
      idRestaurant: restaurantId.toString()
    }

    const responsePlan = await client
      .post(`http://api.zalgow.link:3333/api/plans/${restaurantId}`)
      .json(planPayload)
      .header('Authorization', `Bearer ${token}`)

    responsePlan.assertStatus(200)
    assert.equal(responsePlan.body().nom, planPayload.nom)
    assert.equal(responsePlan.body().idRestaurant, planPayload.idRestaurant)
  })
})
