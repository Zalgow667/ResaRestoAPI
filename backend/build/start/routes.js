const RestaurantsController = () => import('#controllers/restaurants_controller');
const UsersController = () => import('#controllers/users_controller');
const PlansController = () => import('#controllers/plans_controller');
const TablesController = () => import('#controllers/tables_controller');
const ServicesController = () => import('#controllers/services_controller');
const BookingsController = () => import('#controllers/bookings_controller');
const SocialController = () => import('#controllers/social_controller');
import router from '@adonisjs/core/services/router';
router.get('/', async () => {
    return 'Hello World!';
});
router
    .group(() => {
    router
        .group(() => {
        router.post('/:id', [TablesController, 'createTable']);
        router.put('/:id', [TablesController, 'editTable']);
        router.delete('/:id', [TablesController, 'deleteTable']);
    })
        .prefix('tables');
    router
        .group(() => {
        router.post('/', [BookingsController, 'createBooking']);
    })
        .prefix('bookings');
    router
        .group(() => {
        router.delete('/', [UsersController, 'logout']);
    })
        .prefix('logout');
    router
        .group(() => {
        router.get('/restaurant', [RestaurantsController, 'getAllRestaurant']);
        router.get('/user', [UsersController, 'getAllUsers']);
    })
        .prefix('all');
    router
        .group(() => {
        router.post('/', [RestaurantsController, 'createRestaurant']);
        router.put('/:id', [RestaurantsController, 'editRestaurant']);
        router.delete('/:id', [RestaurantsController, 'deleteRestaurant']);
        router.get('/', [RestaurantsController, 'getAllMyManagedRestaurant']);
        router.get('/:id', [RestaurantsController, 'getRestaurantById']);
        router
            .group(() => {
            router.post('/', [ServicesController, 'createService']);
            router.put('/:id_service', [ServicesController, 'editService']);
            router.delete('/:id_service', [ServicesController, 'deleteService']);
            router.get('/', [ServicesController, 'getMyServices']);
        })
            .prefix('/:id/services');
    })
        .prefix('restaurants');
    router
        .group(() => {
        router.get('/:id', [PlansController, 'getPlanFromRestaurantId']);
        router.post('/:restaurant_id', [PlansController, 'createPlan']);
        router.put('/:plan_id', [PlansController, 'editPlan']);
        router.delete('/:plan_id', [PlansController, 'deletePlan']);
    })
        .prefix('plans');
    router
        .group(() => {
        router.post('/register', [UsersController, 'createUser']);
        router.put('/:id', [UsersController, 'editUser']);
        router.post('/login', [UsersController, 'login']);
        router.get('/info', [UsersController, 'getUserInfo']);
        router.delete('/:id', [UsersController, 'deleteUser']);
    })
        .prefix('users');
    router
        .group(() => {
        router.get('/redirect', [SocialController, 'googleRedirect']);
        router.get('/callback', [SocialController, 'googleCallback']);
    })
        .prefix('google');
})
    .prefix('api');
//# sourceMappingURL=routes.js.map