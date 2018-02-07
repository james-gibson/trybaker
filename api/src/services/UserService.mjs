//@flow
import UserDAO from './data/dao/UserDao.mjs';
import User from '../models/User.mjs';
import type {DataProvider} from './data/dataProvider.mjs';
import PROVIDERS from './data/providers/providerEnum.mjs';

const createUser = dao => (data: User) =>
    dao.createUser(data)
        .catch((error: *) => {
            throw error;
        });

const deleteUser = dao => (data: User) => dao.deleteUserById(data.id);

const getUser = dao => (user: User) => dao.getUserById(user.id);

const getUserByEmail = dao => (email: string) => dao.getUserByEmail(email);

const getUserById = dao => (id: string) => dao.getUserById(id);

const getUserByPhone = dao => (phone: string) => dao.getUserByPhone(phone);

class UserService {
    createUser: (data: User) => Promise<User>;
    deleteUser: (data: User) => Promise<*>;
    getUser: (user: User) => Promise<?User>;
    getUserByEmail: (email: string) => Promise<?User>;
    getUserById: (id: string) => Promise<?User>;
    getUserByPhone: (phone: string) => Promise<?User>;

    constructor(dataProvider: DataProvider) {
        const userDAO = new UserDAO(dataProvider.get(PROVIDERS.POSTGRES));

        this.createUser = createUser(userDAO);
        this.deleteUser = deleteUser(userDAO);
        this.getUser = getUser(userDAO);
        this.getUserByEmail = getUserByEmail(userDAO);
        this.getUserById = getUserById(userDAO);
        this.getUserByPhone = getUserByPhone(userDAO);
    }
}

export default UserService;