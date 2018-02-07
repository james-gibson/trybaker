//@flow
import type {DataProvider} from './data/dataProvider.mjs';
import PROVIDERS from './data/providers/providerEnum.mjs';
import UserDAO from "./data/dao/UserDao.mjs";
import AuthDAO from "./data/dao/AuthDao.mjs";

const authenticateChallenge = (userDao: UserDAO, authDao: AuthDAO) => (type: 'EMAIL' | 'PHONE') => (value:string) => (code:string) => {
    return authDao.validateChallenge(type,value,code)
            .then(result => {
                return result;
            })
};

const newChallenge = (authDao:AuthDAO) => (type: 'EMAIL' | 'PHONE') => (value:string) => {
    return authDao.createChallenge(type,value)
        .then(result => {
            console.log(result);
            return result;
        })
};

class AuthService {
    authenticateEmailChallenge: (email:string) => (code:string) => Promise<*>;
    authenticatePhoneChallenge: (phone:string) => (code:string) => Promise<*>;
    newEmailChallenge: (email:string) => Promise<*>;
    newPhoneChallenge: (phone:string) => Promise<*>;

    constructor(dataProvider: DataProvider) {
        const authDao = new AuthDAO(dataProvider.get(PROVIDERS.POSTGRES));
        const userDao = new UserDAO(dataProvider.get(PROVIDERS.POSTGRES));
        this.authenticateEmailChallenge = authenticateChallenge(userDao, authDao)('EMAIL');
        this.authenticatePhoneChallenge = authenticateChallenge(userDao, authDao)('PHONE');
        this.newEmailChallenge = newChallenge(authDao)('EMAIL');
        this.newPhoneChallenge = newChallenge(authDao)('PHONE');
    }
}

export default AuthService;