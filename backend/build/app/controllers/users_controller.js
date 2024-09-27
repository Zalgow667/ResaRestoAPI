import AuthAccessToken from '#models/auth_access_token';
import User from '#models/user';
import { loginValidator, editValidator, registerValidator } from '#validators/auth';
export default class UsersController {
    async createUser({ request, response }) {
        const data = await request.validateUsing(registerValidator);
        const user = await User.create(data);
        try {
            await User.accessTokens.create(user, ['*'], {
                expiresIn: '1 days',
            });
            const tokenUser = await this.getTokenFromId(user.id_user);
            return { tokenUser, user };
        }
        catch (error) {
            return response.status(503).send({
                error: 'DataBase server is out of service, impossible to create user',
            });
        }
    }
    async deleteUser({ response, params }) {
        const userId = params.id;
        const user = await User.find(userId);
        if (!user) {
            return response.status(404).send({
                error: 'User not found',
            });
        }
        try {
            await user.delete();
            return response.status(200).send({
                message: 'User deleted successfully',
            });
        }
        catch (error) {
            return response.status(503).send({
                error: 'DataBase server is out of service, impossible to delete user',
            });
        }
    }
    async editUser({ request, response, params }) {
        const data = await request.validateUsing(editValidator);
        const token = request.header('Authorization');
        const userId = params.id;
        if (!userId || !token) {
            return response.status(400).send({
                error: 'Invalid Params',
            });
        }
        const user = await User.find(userId);
        const userToken = await this.getTokenFromId(userId);
        if (!userToken) {
            return response.status(404).send({
                error: 'Unknow Token',
            });
        }
        if (token.replace('Bearer ', '') !== userToken.hash) {
            return response.status(401).send({
                error: 'Unauthorized',
            });
        }
        if (!user) {
            return response.status(404).send({
                error: 'User not found',
            });
        }
        try {
            user.merge(data);
            await user.save();
            return response.status(200).send({
                message: 'User updated successfully',
                user,
            });
        }
        catch (error) {
            return response.status(503).send({
                error: 'DataBase server is out of service, impossible to update user',
            });
        }
    }
    async login({ request, response }) {
        const { email, password } = await request.validateUsing(loginValidator);
        const user = await User.verifyCredentials(email, password);
        try {
            await User.accessTokens.create(user, ['*'], {
                expiresIn: '1 days',
            });
            const tokenUser = await this.getTokenFromId(user.id_user);
            return { tokenUser, user };
        }
        catch (error) {
            return response.status(503).send({
                error: 'DataBase server is out of service, impossible to log the user',
            });
        }
    }
    async logout({ request, response }) {
        const token = request.header('Authorization');
        if (!token) {
            return response.status(400).send({
                error: 'Authorization token is missing',
            });
        }
        const tokenHash = token.replace('Bearer ', '');
        const authToken = await AuthAccessToken.query().where('hash', tokenHash).first();
        if (!authToken) {
            return response.status(404).send({
                error: 'Token not found',
            });
        }
        try {
            await authToken.delete();
            return response.status(200).send({
                message: 'Token successfully deleted',
            });
        }
        catch (error) {
            return response.status(503).send({
                error: 'Error occurred during logout process',
            });
        }
    }
    async getUserInfo({ request, response }) {
        const authorizationHeader = request.header('Authorization');
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return request;
        }
        const token = authorizationHeader.replace('Bearer ', '');
        try {
            const user = await this.getUserFromToken(token);
            if (user) {
                const tokenUser = await this.getTokenFromId(user.id_user);
                return { tokenUser, user };
            }
        }
        catch (error) {
            return response.status(503).send({
                error: 'DataBase server is out of service, impossible to get user info',
            });
        }
    }
    async getIdUserFromToken(token) {
        try {
            const cleanedToken = token.replace('Bearer ', '');
            const userToken = await AuthAccessToken.query()
                .where('hash', cleanedToken)
                .select('tokenable_id')
                .first();
            if (userToken) {
                return userToken.tokenableId;
            }
            return null;
        }
        catch (error) {
            console.error('Error retrieving user ID from token:', error);
            return null;
        }
    }
    async getUserFromToken(token) {
        const id = await this.getIdUserFromToken(token);
        if (!id) {
            return null;
        }
        const user = await User.find(id);
        if (!user) {
            return null;
        }
        return user;
    }
    async getTokenFromId(userId) {
        const userToken = await AuthAccessToken.query()
            .where('tokenable_id', userId)
            .select('hash')
            .first();
        return userToken;
    }
    async getAllUsers({ request, response }) {
        const limit = request.input('_limit', 10);
        const page = request.input('_page', 1);
        try {
            const users = await User.query().paginate(page, limit);
            return response.status(200).send(users);
        }
        catch (error) {
            console.error(error);
            return response.status(503).send({
                error: 'Database server is out of service, impossible to retrieve users',
            });
        }
    }
}
//# sourceMappingURL=users_controller.js.map