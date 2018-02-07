//@flow
import Knex from 'knex';
import BaseProvider from './baseProvider.mjs';
import PROVIDERS from "./providerEnum.mjs";

class PostGresProvider extends BaseProvider {
    key:typeof PROVIDERS.POSTGRES;
    service: *;

    constructor() {
        console.log('    Initializing Postgres Provider')
        super();
        this.key = PROVIDERS.POSTGRES;


        const conn = Knex({
            client: 'pg',
            connection: process.env.DATABASE_URL,
        });

        this.service = conn;
    }
}

export default PostGresProvider;