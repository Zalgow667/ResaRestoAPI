import { test } from '@japa/runner'

const userPayload = {
  firstName: 'Heston',
  lastName: 'Blumenthal',
  email: 'heston.blumenthal@gmail.com',
  password: 'P@ssword1',
}

const restaurantPayload = {
  name: 'Le Siecle',
  streetNumber: '5',
  streetName: 'rue des Apagnans',
  city: 'Rouen',
  postalCode: '75001',
  country: 'France',
  phone: '0666666666',
}

var token: String
var restaurantId: String

test.group('editRestaurant', () => {
  test('edit restaurant with valid token', async ({ client, assert }) => {
    const response = await client.post('http://api.zalgow.link:3333/api/users/register').json(userPayload)
    token = response.body().tokenUser.hash

    const createResponse = await client
      .post('http://api.zalgow.link:3333/api/restaurants')
      .json(restaurantPayload)
      .header('Authorization', `Bearer ${token}`)

    assert.equal(createResponse.body().name, restaurantPayload.name)
    assert.equal(createResponse.body().streetNumber, restaurantPayload.streetNumber)
    assert.equal(createResponse.body().streetName, restaurantPayload.streetName)
    assert.equal(createResponse.body().city, restaurantPayload.city)
    assert.equal(createResponse.body().postalCode, restaurantPayload.postalCode)
    assert.equal(createResponse.body().country, restaurantPayload.country)
    assert.equal(createResponse.body().phone, restaurantPayload.phone)

    restaurantId = createResponse.body().idRestaurant

    const updatePayload = {
      name: 'Le millenaire',
      streetNumber: '6',
      streetName: 'rue des Apagnans',
      city: 'Bastia',
      postalCode: '75001',
      country: 'France',
      phone: '0777777777',
    }

    const updateResponse = await client
      .put(`http://api.zalgow.link:3333/api/restaurants/${restaurantId}`)
      .json(updatePayload)
      .header('Authorization', `Bearer ${token}`)

    updateResponse.assertStatus(200)
    assert.equal(updateResponse.body().name, updatePayload.name)
    assert.equal(updateResponse.body().streetNumber, updatePayload.streetNumber)
    assert.equal(updateResponse.body().streetName, updatePayload.streetName)
    assert.equal(updateResponse.body().city, updatePayload.city)
    assert.equal(updateResponse.body().postalCode, updatePayload.postalCode)
    assert.equal(updateResponse.body().country, updatePayload.country)
    assert.equal(updateResponse.body().phone, updatePayload.phone)
  })
  
  test('edit restaurant with missing token', async ({ client, assert }) => {
    const restaurantId = 1

    const updatePayload = {
      name: 'Updated Tavola',
      streetNumber: '6',
      streetName: 'rue des Apagnans',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
      phone: '0777777777',
    }

    const response = await client
      .put(`http://api.zalgow.link:3333/api/restaurants/${restaurantId}`)
      .json(updatePayload)
    response.assertStatus(400)
    assert.deepEqual(response.body(), { error: 'Authorization token is missing' })
  })
  
  test('edit restaurant with non-existent restaurant ID', async ({ client, assert }) => {
    const restaurantId = 9999

    const updatePayload = {
      name: 'Updated Tavola',
      streetNumber: '6',
      streetName: 'rue des Apagnans',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
      phone: '0777777777',
    }

    const updateResponse = await client
      .put(`http://api.zalgow.link:3333/api/restaurants/${restaurantId}`)
      .json(updatePayload)
      .header('Authorization', `Bearer ${token}`)
    updateResponse.assertStatus(404)
    assert.deepEqual(updateResponse.body(), { error: 'Restaurant not found' })
  })
  
  test('edit restaurant with unauthorized user', async ({ client, assert }) => {
    const response = await client
      .post('http://api.zalgow.link:3333/api/users/register')
      .json({ ...userPayload, email: 'other.user@gmail.com' })
    const otherUserToken = response.body().tokenUser.hash

    const createResponse = await client
      .post('http://api.zalgow.link:3333/api/restaurants')
      .json(restaurantPayload)
      .header('Authorization', `Bearer ${token}`)
    const restaurantId = createResponse.body().idRestaurant

    const updatePayload = {
      name: 'Unauthorized Tavola',
      streetNumber: '7',
      streetName: 'rue des Apagnans',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
      phone: '0888888888',
    }

    const updateResponse = await client
      .put(`http://api.zalgow.link:3333/api/restaurants/${restaurantId}`)
      .json(updatePayload)
      .header('Authorization', `Bearer ${otherUserToken}`)
    updateResponse.assertStatus(401)
    assert.deepEqual(updateResponse.body(), {
      error: 'You are not authorized to access this restaurant',
    })
  })
  
  test('edit restaurant with invalid token', async ({ client, assert }) => {
    token = '3330ba8d798cfe818adcda77dfd91aa67f2239572d4d6dd266ab7645304994bb'
    const restaurantId = 1

    const updatePayload = {
      name: 'Updated Tavola',
      streetNumber: '6',
      streetName: 'rue des Apagnans',
      city: 'Paris',
      postalCode: '75001',
      country: 'France',
      phone: '0777777777',
    }

    const response = await client
      .put(`http://api.zalgow.link:3333/api/restaurants/${restaurantId}`)
      .json(updatePayload)
      .header('Authorization', `Bearer ${token}`)
    response.assertStatus(404)
    assert.deepEqual(response.body(), { error: 'Invalid or expired token' })
  })
})
