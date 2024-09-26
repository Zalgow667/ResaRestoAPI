import { test } from '@japa/runner'

const user = {
  email: 'user.restaurant@test.fr',
  password: 'P@ssword1',
  firstName: 'Test',
  lastName: 'Restaurant',
}
const restaurant = {
  name: 'La mie paulette',
  streetNumber: '60',
  streetName: 'rue du Coq',
  city: 'Nancy',
  postalCode: '75001',
  country: 'France',
  phone: '0666666611',
}
const service = {
  start: '12:33:00',
  end: '15:33:00',
  name: 'Le service du matin',
  day: 'Monday',
}
const service2 = {
  start: '14:33:00',
  end: '19:33:00',
  name: 'Le service du matin',
  day: 'Tuesday',
}
const serviceErr = {
  start: '14:33:00',
  end: '13:33:00',
  name: 'Le service du matin',
  day: 'Tuesday',
}
const serviceEdit = {
  start: '14:30:00',
  end: '19:30:00',
  name: 'Le service du jour',
  day: 'Monday',
}
let userToken: any
let idRestaurant: any
let idService: any

test.group('Services', () => {
  test('Create Service', async ({ client, assert }) => {
    const response = await client.post('http://api.zalgow.link:3333/api/users/register').json(user)
    response.assertStatus(200)
    userToken = response.body().tokenUser.hash

    const responseResto = await client
      .post('http://api.zalgow.link:3333/api/restaurants')
      .header('Authorization', `Bearer ${userToken}`)
      .json(restaurant)
    responseResto.assertStatus(200)
    assert.exists(responseResto.body().idRestaurant)

    idRestaurant = responseResto.body().idRestaurant

    const responseService = await client
      .post('http://api.zalgow.link:3333/api/restaurants/' + idRestaurant + '/services')
      .header('Authorization', `Bearer ${userToken}`)
      .json(service)

    responseService.assertStatus(200)
    idService = responseService.body().idService
    assert.equal(responseService.body().day, service.day)
    assert.equal(responseService.body().name, service.name)
    assert.equal(responseService.body().end, service.end)
    assert.equal(responseService.body().start, service.start)
  })
  test('Create a service on another restaurant', async ({ client }) => {
    const responseService = await client
      .post('http://api.zalgow.link:3333/api/restaurants/' + idRestaurant + '/services')
      .header('Authorization', `Bearer ${userToken}` + 'a')
      .json(service2)
    responseService.assertStatus(400)
  })
  test('Create a service with mistakes', async ({ client }) => {
    const responseService = await client
      .post('http://api.zalgow.link:3333/api/restaurants/' + idRestaurant + '/services')
      .header('Authorization', `Bearer ${userToken}`)
      .json(serviceErr)
    responseService.assertStatus(400)
  })
  test('Edit my service', async ({ client, assert }) => {
    const responseService = await client
      .put('http://api.zalgow.link:3333/api/restaurants/' + idRestaurant + '/services/' + idService)
      .header('Authorization', `Bearer ${userToken}`)
      .json(serviceEdit)
    responseService.assertStatus(200)
    assert.exists(responseService.body())
    assert.equal(responseService.body().start, serviceEdit.start)
    assert.equal(responseService.body().end, serviceEdit.end)
    assert.equal(responseService.body().day, serviceEdit.day)
  })
})
