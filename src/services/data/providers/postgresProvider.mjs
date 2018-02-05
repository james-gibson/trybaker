//@flow
import BaseProvider from './baseProvider.mjs';
import PROVIDERS from "./providerEnum.mjs";

class PostGresProvider extends BaseProvider {
    key:typeof PROVIDERS.POSTGRES;
    service: *;

    constructor() {
        super();
        this.key = PROVIDERS.POSTGRES;

        this.service = {};
    }
}

export default PostGresProvider;