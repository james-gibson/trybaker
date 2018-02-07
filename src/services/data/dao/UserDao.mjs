// @flow
import Knex from 'knex';
import User from '../../../models/User.mjs';
const userDTO = {
    toPostgres: (input: User): * => {
        const result = {
            firstName: input.firstName,
            lastName: input.lastName,
            phoneNumber: input.phoneNumber,
            emailAddress: input.emailAddress,
            validatedPhoneNumber: input.validPhone,
            validatedEmailAddress: input.validEmail,
            newCustomer : input.newCustomer,
        };

        return result;
    },
    fromPostgres: (input: *): ?User => {
        if (!input) return null;

        const user = new User();
        user.id =  input.id;
        user.lastName = input.lastName;
        user.firstName = input.firstName
        user.phoneNumber = input.phoneNumber;
        user.emailAddress = input.emailAddress;
        user.validPhone = input.validatedPhoneNumber;
        user.validEmail = input.validatedEmailAddress;
        user.newCustomer = input.newCustomer;
        return user;
    },
};

const createUser = table => (user: User) => new Promise((resolve, reject) => {
    table.insert(userDTO.toPostgres(user))
        .returning('*')
        .then((result) => {
            if (!result) { return reject(new Error('Something unexpected happened')); }

            return resolve(result.map(userDTO.fromPostgres)[0]);
        })
        .catch(reject);
});

const deleteUserById = table => (id: string) =>
    new Promise((resolve: (*) => void, reject) => {
        table
            .where('id', id)
            .del()
            .then(resolve)
            .catch(reject);
    });

const getUserByField = table => field => value =>
    new Promise((resolve: (?User) => void, reject) => {
        table
            .where(field, value)
            .limit(1)
            .then((result: Array<*>) => {
                resolve(userDTO.fromPostgres(result[0]));
            })
            .catch((err) => {
                reject(err);
            });
    });

class UserDAO {
    createUser: (user: User) => Promise<User>;
    deleteUserById: (id: string) => Promise<*>;
    getUserByEmail: (email: string) => Promise<?User>;
    getUserById: (id: string) => Promise<?User>;
    getUserByPhone: (phone: string) => Promise<?User>;

    constructor(knex: Knex) {
        const table = knex(`users`);

        this.createUser = createUser(table);
        this.deleteUserById = deleteUserById(table);
        this.getUserByEmail = (email: string) => getUserByField(table)('emailAddress')(email);
        this.getUserById = (id: string) => getUserByField(table)('id')(id);
        this.getUserByPhone = (phone: string) => getUserByField(table)('phoneNumber')(phone);
    }
}

export default UserDAO;
