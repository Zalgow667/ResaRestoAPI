import { test } from '@japa/runner'

const userPayload = {
  firstName: 'Thomas',
  lastName: 'Keller',
  email: 'thomas.keller@gmail.com',
  password: 'P@ssword1',
}

const restaurantPayload = {
  name: 'La Buona Tavola',
  streetNumber: '5',
  streetName: 'rue des Apagnans',
  city: 'Ifs',
  postalCode: '75001',
  country: 'France',
  phone: '0666666666',
}

var token: String

test.group('createRestaurant', () => {
  test('create restaurant with missing token', async ({ client, assert }) => {
    const createrRsponse = await client
      .post('https://api.zalgow.xyz/api/restaurants')
      .json(restaurantPayload)
    
      createrRsponse.assertStatus(400)
    assert.deepEqual(createrRsponse.body(), { error: 'Authorization token is missing' })
  })

  test('create restaurant with invalid token', async ({ client, assert }) => {
    token = '3330ba8d798cfe818adcda77dfd91aa67f2239572d4d6dd266ab7645304994bb'

    const response = await client
      .post('https://api.zalgow.xyz/api/restaurants')
      .json(restaurantPayload)
      .header('Authorization', `Bearer ${token}`)
    
    response.assertStatus(404)
    assert.deepEqual(response.body(), { error: 'Invalid or expired token' })
  })

  test('create restaurant with valid token', async ({ client, assert }) => {
    const response = await client.post('https://api.zalgow.xyz/api/users/register').json(userPayload)
    token = response.body().tokenUser.hash

    const createResponse = await client
      .post('https://api.zalgow.xyz/api/restaurants')
      .json(restaurantPayload)
      .header('Authorization', `Bearer ${token}`)
    
    createResponse.assertStatus(200)
    assert.equal(createResponse.body().name, restaurantPayload.name)
    assert.equal(createResponse.body().streetNumber, restaurantPayload.streetNumber)
    assert.equal(createResponse.body().streetName, restaurantPayload.streetName)
    assert.equal(createResponse.body().city, restaurantPayload.city)
    assert.equal(createResponse.body().postalCode, restaurantPayload.postalCode)
    assert.equal(createResponse.body().country, restaurantPayload.country)
    assert.equal(createResponse.body().phone, restaurantPayload.phone)
  })
})
