//@flow
import {DataProvider} from "./data/dataProvider.mjs";
import AuthDAO from "./data/dao/AuthDao.mjs";
import UserDAO from "./data/dao/UserDao.mjs";
import PROVIDERS from "./data/providers/providerEnum.mjs";

const prepareActionMessage = (dataProvider:DataProvider) => (type: 'EMAIL' | 'PHONE') => {
    const sendgrid = dataProvider.get(PROVIDERS.SENDGRID);
    const twilio = dataProvider.get(PROVIDERS.TWILIO);
    if(type == 'EMAIL') {
        return (email:string, code:string) => {
            const header = 'Hi from TryBaker';
            const body = `Looks like you are trying to log in, please click http://localhost:3000/api/verify/email/${email}/${code}`;
            sendgrid.sendEmail(header)(body)(email);
        }
    } else {
        return (phone:string, code:string) => {
            const smsBody = `Hi from TryBaker.  The code you requested is: ${code}`;
            twilio.sendSMS(smsBody)(phone);
        }
    }
};

const verification = (dataProvider:DataProvider) => (type: 'EMAIL' | 'PHONE', value:string, code:string) => {
    const authDao = new AuthDAO(dataProvider.get(PROVIDERS.POSTGRES));
    const userDao = new UserDAO(dataProvider.get(PROVIDERS.POSTGRES));


    // Because this supports both sms and email verification we
    // get a little crafty and prep values that will be useful
    const preparedMessageType = type == 'EMAIL' ? 'email' : 'sms';
    const preparedInfoMessage = `An ${preparedMessageType} has been sent to ${value}.  Please follow instructions`;
    const sendMessageTo = prepareActionMessage(dataProvider)(type);

    return authDao.validateChallenge(type,value, code)
        .then(isValid =>{
            if(!isValid) {
                return authDao.createChallenge(type,value).then((challengeCode:string) => {
                    // lets send sms or email based on criteria
                    sendMessageTo(value,challengeCode);

                    return {
                        status:'pending',
                        data: undefined,
                        message: preparedInfoMessage
                    }
                });
            } else {
                return {
                    status:'valid',
                    data: {fakeUser:123},
                    message: 'Success'
                }
            }
        })
};

class ApiService {
    verify: (type: 'EMAIL' | 'PHONE', value:string, code:string) => Promise<*>;
    constructor(dataProvider:DataProvider) {
        this.verify = verification(dataProvider);
    }
}

export default ApiService;
