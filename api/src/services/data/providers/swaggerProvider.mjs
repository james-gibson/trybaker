//@flow
import BaseProvider from './baseProvider.mjs';
import PROVIDERS from "./providerEnum.mjs";
import SwaggerDefinition from '../static/swagger.mjs';
class SwaggerProvider extends BaseProvider {
    key:typeof PROVIDERS.SWAGGER;
    service: *;

    constructor() {
        console.log('    Initializing Swagger Provider')
        super();
        this.key = PROVIDERS.SWAGGER;

        this.service = SwaggerDefinition;
    }
}

export default SwaggerProvider;