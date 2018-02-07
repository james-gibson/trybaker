//@flow
import BaseProvider from './baseProvider.mjs';
import PROVIDERS from "./providerEnum.mjs";

import Sendgrid  from '@sendgrid/mail';

const sendEmail = sendgrid => (subject:string) => (body:string) => (email:string) => {
    const msg = {
        to: email,
        from: 'trybaker@example.com',
        subject: subject,
        text: body,
    };
    sendgrid.send(msg);
};

class SendgridProvider extends BaseProvider {
    key:typeof PROVIDERS.SENDGRID;
    service: *;

    constructor() {
        console.log('    Initializing SendGrid Provider');
        super();
        this.key = PROVIDERS.SENDGRID;

        const sendgrid = new Sendgrid.MailService();
        sendgrid.setApiKey(process.env.S_API_KEY);
        this.service = {
            sendEmail: sendEmail(sendgrid)
        }

        const sendTestEmail = sendEmail(sendgrid)('hello world')('this is a test');
        //sendTestEmail('james@gibsunas.co');
    }
}

export default SendgridProvider;