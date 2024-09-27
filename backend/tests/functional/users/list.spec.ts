import { test } from '@japa/runner'

test.group('Users', () => {
    test('create user', async ({ client, assert }) => {
        const userPayload = {
            firstName: 'Test',
            lastName: 'Unitaire',
            email: 'test.unitaire@gmail.com',
            password: 'P@ssword1',
        }
        
        const response = await client.post('http://api.zalgow.xyz/api/users/register').json(userPayload)
        response.assertStatus(200)
        assert.exists(response.body().tokenUser.hash)
        assert.exists(response.body().user)
    })
  
    test('mistakes on user infos', async ({ client }) => {
        const userPayload = {
            firstName: 'Test',
            lastName: 'Unitaire',
            email: 'test.unitaire@gmail.com',
            password: 'P@ssword1',
        }

        const response = await client.post('http://api.zalgow.xyz/api/users/register').json(userPayload)
        response.assertStatus(422)

        const userPayload2 = {
            firstName: 'Test',
            lastName: 'Unitaire',
            email: 'test.unitaire@gmail.com',
            password: 'Pssword',
        }
        const response2 = await client
            .post('http://api.zalgow.xyz/api/users/register')
            .json(userPayload2)
        response2.assertStatus(422)
    })

    test('edit user without token', async ({ client }) => {
        const userPayload = {
            firstName: 'Test',
            lastName: 'Edition',
            email: 'test.edition@gmail.com',
            password: 'P@ssword1',
        }
        const response = await client.post('http://api.zalgow.xyz/api/users/register').json(userPayload)

        const userId = response.body().user.idUser

        const response2 = await client
            .put('http://api.zalgow.xyz/api/users/' + userId)
            .json(userPayload)

        response2.assertStatus(400)
    })

    test('edit user with token', async ({ client, assert }) => {
        const userPayload = {
            firstName: 'Test',
            lastName: 'Edition',
            email: 'test.editionwitoken@gmail.com',
            password: 'P@ssword1',
        }

        const response = await client.post('http://api.zalgow.xyz/api/users/register').json(userPayload)
        const userId = response.body().user.idUser
        let token = response.body().tokenUser.hash

        userPayload.email = 'neweeeemail@test.fr'
        userPayload.firstName = 'edited'
        userPayload.lastName = 'edited'

        const editResponse = await client
            .put('http://api.zalgow.xyz/api/users/' + userId)
            .header('Authorization', `Bearer ${token}`)
            .json(userPayload)

        editResponse.assertStatus(200)
        token += 'a'
        userPayload

        const responseWithFalseToken = await client
            .put('http://api.zalgow.xyz/api/users/' + userId)
            .header('Authorization', `Bearer ${token}`)
            .json(userPayload)
        responseWithFalseToken.assertStatus(401)

        assert.equal(editResponse.body().user.firstName, userPayload.firstName)
        assert.equal(editResponse.body().user.lastName, userPayload.lastName)
    })

    test('login with email / password', async ({ client, assert }) => {
        const userPayload = {
            firstName: 'Test',
            lastName: 'Connection',
            email: 'test.connection@gmail.com',
            password: 'P@ssword1',
        }

        const response = await client.post('http://api.zalgow.xyz/api/users/register').json(userPayload)
        response.assertStatus(200)
        const email = userPayload.email
        const password = userPayload.password

        const editResponse = await client
        .post('http://api.zalgow.xyz/api/users/login')
        .json({ email, password })

        editResponse.assertStatus(200)

        assert.equal(editResponse.body().user.email, email)
        assert.equal(editResponse.body().user.firstName, userPayload.firstName)
        assert.equal(editResponse.body().user.lastName, userPayload.lastName)
    })

    test('login with wrong email / password', async ({ client }) => {
        const userPayload = {
            firstName: 'Test',
            lastName: 'Connection',
            email: 'test.connection2@gmail.com',
            password: 'P@ssword1',
        }
        const response = await client.post('http://api.zalgow.xyz/api/users/register').json(userPayload)
        response.assertStatus(200)
        const email = 'test.wrong@gmail.com'
        const password = userPayload.password

        const editResponse = await client
            .post('http://api.zalgow.xyz/api/users/login')
            .json({ email, password })
        editResponse.assertStatus(400)
    })
})
