//@flow
import BaseProvider from './baseProvider.mjs';
import PROVIDERS from "./providerEnum.mjs";

import Sendgrid from '@sendgrid/mail';

class SendgridProvider extends BaseProvider {
    key:typeof PROVIDERS.SENDGRID;
    service: *;

    constructor() {
        super();
        this.key = PROVIDERS.SENDGRID;
        this.service = Sendgrid.setApiKey(process.env.S_API_KEY);
    }
}

export default SendgridProvider;