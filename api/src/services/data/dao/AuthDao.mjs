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
    fromPostgres: (input: *): ?{id: string, challenge:string} => {
        if (!input) return null;
        return {
            id: input.id,
            userId: input.userId,
            challenge: input.expectedCode,
        }
    },
};

const generateChallengeCode = (type:'EMAIL' | 'PHONE') => {
    if(type =='EMAIL') {
        return 'not-working';
    } else {
        return Shortid.generate().slice(0,5);
    }
};

const createChallenge = table => (type:'EMAIL' | 'PHONE', value:string) => new Promise((resolve, reject) => {
    const challenge = generateChallengeCode(type);

    table.insert(DTO.toPostgres({type,value,challenge}))
        .returning('*')
        .then((result) => {
            if (!result) { return reject(new Error('Something unexpected happened')); }
            const record = result.map(DTO.fromPostgres)[0];

            return resolve({id:record.id,challenge:record.challenge});
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

const addUserIdById = table => (id: string) => (userId:string) =>
    new Promise((resolve: (*) => void, reject) => {
        table
            .where('id', id)
            .update('userId', userId)
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
            .then((result) => {
                if (!result) { return new Error('Something unexpected happened'); }
                const record = result.map(DTO.fromPostgres)[0];

                if(!record) {
                    return {}
                } else {
                    return {
                        id: record.id,
                        isValid: true,
                        userId: record.userId,
                        challenge:record.challenge
                    };
                }
            });


class AuthDAO {
    createChallenge: (type:'EMAIL' | 'PHONE', value:string) => Promise<*>;
    deleteChallengeById: (id:string) => Promise<void>;
    addUserIdById: (id:string) => (userId:string) => Promise<void>;
    validateChallenge: (type:'EMAIL' | 'PHONE', value:string, code:string) => Promise<{isValid:boolean, id:string, userId:string}>;

    constructor(knex: Knex) {
        const table = knex(`verifications`);

        this.createChallenge = createChallenge(table);
        this.deleteChallengeById = deleteChallengeById(table);
        this.addUserIdById = addUserIdById(table);
        this.validateChallenge = validateChallenge(table);
    }
}

export default AuthDAO;
