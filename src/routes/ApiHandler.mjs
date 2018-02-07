//@flow
import express from 'express';
import isValidEmail from 'is-valid-email';
import isPhoneNumber from 'is-phone-number';
import ApiService from "../services/ApiService.mjs";

const router = express.Router();

const createService = (req:*) => new ApiService(req.custom.dataProvider);

const verification = (apiService:ApiService) =>
    (type: 'EMAIL' | 'PHONE', value:string, code:string) => apiService.verify(type,value,code);

const verifyEmail = (req, res) => {
    const {code, email} = req.params;

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
    const {code, phone} = req.params;
    const verify = verification(createService(req));

    console.log(phone, decodeURI(phone), isPhoneNumber(decodeURI(phone)));
    if(!isPhoneNumber(decodeURI(phone))){
        res.statusCode = 400;
        res.json({status: 'error', message:'invaild input'});

        return;
    }

    verify('PHONE',phone,code).then(result => {
        res.json(result);
    }).catch(res.json)
};

class ApiHandler {
    static verifyEmail() {
        return verifyEmail;
    }

    static verifyPhone() {
        return verifyPhone;
    }
}

router.get('/verify/email/:email/:code', ApiHandler.verifyEmail());
router.get('/verify/phone/:phone/:code', ApiHandler.verifyPhone());



export default router;
