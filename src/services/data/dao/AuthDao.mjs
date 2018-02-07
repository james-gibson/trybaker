// @flow
import Knex from 'knex';
import Shortid from 'shortid';

const DTO = {
    toPostgres: (input) => {
        const {type, value, challenge} = input;
        const result = {
            type: type,
            expectedCode: challenge,
            expectedValue: value,
            created_at: new Date(Date.now()).getTime(),
        };

        return result;
    },
    fromPostgres: (input: *): ?{challenge:string} => {
        if (!input) return null;
        return {
            challenge: input.expectedCode,
        }
    },
};

const generateChallengeCode = (type:'EMAIL' | 'PHONE') => {
    if(type =='EMAIL') {
        return 'not-working';
    } else {
        return Shortid.generate();
    }
};

const createChallenge = table => (type:'EMAIL' | 'PHONE', value:string) => new Promise((resolve, reject) => {
    const challenge = generateChallengeCode(type);

    table.insert(DTO.toPostgres({type,value,challenge}))
        .returning('*')
        .then((result) => {
            if (!result) { return reject(new Error('Something unexpected happened')); }
            const record = result.map(DTO.fromPostgres)[0];

            return resolve(record.challenge);
        })
        .catch(reject);
});

const deleteChallengeById = table => (id: string) =>
    new Promise((resolve: (*) => void, reject) => {
        table
            .where('id', id)
            .del()
            .then(resolve)
            .catch(reject);
    });

const validateChallenge = table => (type, value, code) =>
        table
            .select('*')
            .where('expectedCode', code)
            .where('expectedValue', value)
            .where('type', type)
            .limit(1)
            .then((result: Array<*>) => {
                return !!result[0];
            })


class AuthDAO {
    createChallenge: (type:'EMAIL' | 'PHONE', value:string) => Promise<string>;
    deleteChallengeById: *;
    validateChallenge: (type:'EMAIL' | 'PHONE', value:string, code:string) => Promise<boolean>;

    constructor(knex: Knex) {
        const table = knex(`verifications`);

        this.createChallenge = createChallenge(table);
        this.deleteChallengeById = deleteChallengeById(table);
        this.validateChallenge = validateChallenge(table);
    }
}

export default AuthDAO;
