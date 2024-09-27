import { test } from '@japa/runner'

const userPayload = {
  firstName: 'Jamie',
  lastName: 'Oliver',
  email: 'jamie.oliver@gmail.com',
  password: 'P@ssword1',
}

const restaurantPayload = {
  name: 'La Shounga',
  streetNumber: '5',
  streetName: 'rue des Apagnans',
  city: 'Marseille',
  postalCode: '75001',
  country: 'France',
  phone: '0666666666',
}

var token: String

test.group('deleteRestaurant', () => {
  test('delete restaurant with valid token', async ({ client, assert }) => {
    const response = await client.post('https://api.zalgow.xyz/api/users/register').json(userPayload)
    token = response.body().tokenUser.hash
    
    const createResponse = await client
      .post('https://api.zalgow.xyz/api/restaurants')
      .json(restaurantPayload)
      .header('Authorization', `Bearer ${token}`)

    assert.equal(createResponse.body().name, restaurantPayload.name)
    assert.equal(createResponse.body().streetNumber, restaurantPayload.streetNumber)
    assert.equal(createResponse.body().streetName, restaurantPayload.streetName)
    assert.equal(createResponse.body().city, restaurantPayload.city)
    assert.equal(createResponse.body().postalCode, restaurantPayload.postalCode)
    assert.equal(createResponse.body().country, restaurantPayload.country)
    assert.equal(createResponse.body().phone, restaurantPayload.phone)

    const deleteResponse = await client
      .delete(`https://api.zalgow.xyz/api/restaurants/${createResponse.body().idRestaurant}`)
      .header('Authorization', `Bearer ${token}`)
    
    deleteResponse.assertStatus(200)
    assert.deepEqual(deleteResponse.body(), { message: 'Restaurant deleted successfully' })
  })

  test('delete restaurant with invalid token', async ({ client, assert }) => {
    token = '3330ba8d798cfe818adcda77dfd91aa67f2239572d4d6dd266ab7645304994bb'
    const deleteResponse = await client
      .delete(`https://api.zalgow.xyz/api/restaurants/1`)
      .header('Authorization', `Bearer ${token}`)
    
    deleteResponse.assertStatus(404)
    assert.deepEqual(deleteResponse.body(), { error: 'Invalid or expired token' })
  })

  test('delete restaurant without token', async ({ client, assert }) => {
    const deleteResponse = await client.delete(`https://api.zalgow.xyz/api/restaurants/1`)
    deleteResponse.assertStatus(400)
    assert.deepEqual(deleteResponse.body(), { error: 'Authorization token is missing' })
  })
})
