import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'
import UsersController from './users_controller.js'

export default class SocialController {

    userController = new UsersController()

    googleRedirect({ ally }: HttpContext ) {
        ally.use('google').redirect() 
    }

    async googleCallback({ ally, response }: HttpContext ) {
        const google = ally.use('google')
        const googleUser = await google.user()

        const user = await User.findBy("email", googleUser.email)
        const userName = googleUser.name.split(' ')

        let newUser
        let token

        if(!user) {
            newUser = await User.create({ firstName : userName[0], lastName : userName[1], email : googleUser.email, })
            token = await User.accessTokens.create(newUser)
            const tokenUser = await this.userController.getTokenFromId(newUser.id_user)

            if(newUser){
                response.plainCookie('auth_token', tokenUser?.hash, { encode: false })
                return response.redirect(`http://localhost:3000`)
            }
        } else {
            const tokenUser = await this.userController.getTokenFromId(user.id_user)

            if(tokenUser){
                response.plainCookie('auth_token', tokenUser.hash, { encode: false })
                return response.redirect(`http://localhost:3000`)
            }
        }
    } 
}