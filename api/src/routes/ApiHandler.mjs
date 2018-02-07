//@flow
import express from 'express';
import isValidEmail from 'is-valid-email';
import isPhoneNumber from 'is-phone-number';
import ApiService from "../services/ApiService.mjs";
import User from '../models/User.mjs';
import UserService from "../services/UserService.mjs";
import PointsService from "../services/PointsService.mjs";
const router = express.Router();

const createService = (req:*) => new ApiService(req.custom.dataProvider);

const verification = (apiService:ApiService) =>
    (type: 'EMAIL' | 'PHONE', value:string, code:string) => apiService.verify(type,value,code);

const verifyEmail = (req, res) => {
    const {email} = req.params;
    const {code} = req.query;

    if(!isValidEmail(decodeURI(email))){
        res.statusCode = 400;
        res.json({status: 'error', message:'invaild input'});

        return;
    }

    const verify = verification(createService(req));


    verify('EMAIL',email,code).then(result => {
        res.json(result);
    }).catch(res.json)
};

const verifyPhone = (req, res) => {
    const {phone} = req.params;
    const {code} = req.query;
    const verify = verification(createService(req));
    const userService = new UserService(req.custom.dataProvider);
    const apiService = new ApiService(req.custom.dataProvider);
    const pointsService = new PointsService(req.custom.dataProvider);

    if (!code || !isPhoneNumber(decodeURI(phone))) {
        res.statusCode = 400;
        res.json({status: 'error', message: 'invalid input'});

        return;
    }

    verify('PHONE', phone, code)
        .then(input => {
            return userService.getUserByPhone(phone).then(user => {
                return {user, verification: input, data: undefined}
            })
        })
        .then(input => {
            const {user, verification} = input;
            const firstName = req.query.f;
            const lastName = req.query.l;
            const email = req.query.e;

            let tmpUser = user || new User();

            if (verification.userId) {
                tmpUser.id = verification.userId;
            }

            if (firstName && lastName && email) {
                if(req.query.f) {tmpUser.firstName = req.query.f;}
                if(req.query.l) {tmpUser.lastName = req.query.l;}
                if(req.query.e) {tmpUser.emailAddress = req.query.e;}
                if(req.query.phone) {tmpUser.phoneNumber = phone;}
            }
            return {user: tmpUser, verification, data: undefined};
        }).then(input => {
            const {user, verification} = input;

            // lets bail early if verification was invalid
            if (verification.status !== 'valid') {
                console.log('invalid code used');
                const tmp  = {...input};
                tmp.verification = {...input.verification};
                tmp.verification.status = 'invalid';
                return tmp;
            }

            if (!user.id) {
                console.log('creating new user', user);
                return userService.createUser(user)
                    .then((newUser: User) => {
                        return {...input, user: newUser};
                    })
            } else {
                console.log('verification reported');
                return input;
            }
        }).then((input)=> {
            // If we have a live verification but no associated user id but we have a user
            if(input.verification.id && !input.verification.userId && input.user.id) {
                // Lets connect the two details
                return apiService.connectToUser(input.verification.id)(input.user.id)
                    .then(() => {
                        const tmp = {...input};
                        tmp.verification.userId = input.user.id;
                        return tmp;
                    });
            } else {
                return input;
            }
        }).then((input)=> {
            const user = input.user;
            if(!user.id) return input;

            console.log('checking in');
            let points = 20;

            if(user.newCustomer) {
                points += 30;
            }

            return pointsService.checkIn(user.id, points)
                .then(() => input)
                .catch((err:Error) => {
                    const tmp  = {...input};
                    tmp.verification = {...input.verification};
                    tmp.verification.status = 'too-soon'
                    return tmp;
                } );


        }).then((input) => {
            if(!input.user.id) { return input;}

            return pointsService.report(input.user.id)
                .then((results) => {
                    const tmp  = {...input, data: results};
                    console.log('APIHANDLER:',tmp,results)
                    return tmp;
                });
        }).then((httpResult:*) => {
             res.json({...httpResult.verification, data : httpResult.data, user: httpResult.user});
        }).catch(console.log)

};

class ApiHandler {
    static verifyEmail() {
        return verifyEmail;
    }

    static verifyPhone() {
        return verifyPhone;
    }
}

router.get('/verify/email/:email', ApiHandler.verifyEmail());
router.get('/verify/phone/:phone', ApiHandler.verifyPhone());



export default router;
