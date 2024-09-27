import User from '#models/user';
import UsersController from './users_controller.js';
export default class SocialController {
    userController = new UsersController();
    googleRedirect({ ally }) {
        ally.use('google').redirect();
    }
    async googleCallback({ ally, response }) {
        const google = ally.use('google');
        const googleUser = await google.user();
        const user = await User.findBy("email", googleUser.email);
        const userName = googleUser.name.split(' ');
        let newUser;
        if (!user) {
            newUser = await User.create({ firstName: userName[0], lastName: userName[1], email: googleUser.email, });
            await User.accessTokens.create(newUser);
            const tokenUser = await this.userController.getTokenFromId(newUser.id_user);
            if (newUser) {
                response.plainCookie('auth_token', tokenUser?.hash, { encode: false });
                return response.redirect(`http://localhost:3000`);
            }
        }
        else {
            const tokenUser = await this.userController.getTokenFromId(user.id_user);
            if (tokenUser) {
                response.plainCookie('auth_token', tokenUser.hash, { encode: false });
                return response.redirect(`http://localhost:3000`);
            }
        }
    }
}
//# sourceMappingURL=social_controller.js.map