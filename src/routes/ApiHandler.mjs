//@flow
import express from 'express';
import {DataProvider} from "../services/data/dataProvider.mjs";
import ApiService from "../services/ApiService.mjs";

const router = express.Router();

const createService = (dataProvider:DataProvider) => new ApiService(dataProvider);

const verification = (apiService:ApiService) =>
    (type: 'EMAIL' | 'PHONE', value:string, code:string) => apiService.verify(type,value,code);

const verifyEmail = (req, res) => {
const verifyEmail = (req, res) => {
    const verify = verification(createService(req.custom.dataProvider));
    const {code, email} = req.params;

    verify('EMAIL',email,code).then(result => {
        res.json(result);
    }).catch(res.json)
};

const verifyPhone = (req, res) => {
    const verify = verification(createService(req.custom.dataProvider));
    const {code, phone} = req.params;

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
