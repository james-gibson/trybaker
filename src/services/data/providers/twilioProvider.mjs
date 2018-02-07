//@flow
import BaseProvider from './baseProvider.mjs';
import PROVIDERS from "./providerEnum.mjs";

import Twilio from 'twilio';

const appPhoneNumber = '+17206059279';

const sendSMS = twilio => (message:string) => (phoneNumber:string) => twilio.messages.create({
    from: appPhoneNumber,
    body: message,
    to: phoneNumber
})


class TwilioProvider extends BaseProvider {
    key:typeof PROVIDERS.TWILIO;
    service: *;

    constructor() {
        console.log('    Initializing Twilio Provider');
        super();
        this.key = PROVIDERS.TWILIO;

        const twilio = new Twilio(process.env.T_ACCOUNT_ID, process.env.T_AUTH_TOKEN);

        this.service = {
            sendSMS: sendSMS(twilio)
        };
        //sendSMS(twilio)('4439073453')('hello world');
    }
}

export default TwilioProvider;