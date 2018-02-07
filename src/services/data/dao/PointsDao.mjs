// @flow
import Knex from 'knex';

const DTO = {
    toPostgres: (input:{userId:string, entry:number, timestamp:number}) => {
        const {userId, entry, timestamp} = input;
        const result = {
            entry,
            userId: userId,
            created_at: timestamp,
        };

        return result;
    },
    fromPostgres: (input: *): ?{id: string, userId:string, entry:number} => {
        if (!input) return null;
        return {
            id: input.id,
            userId: input.userId,
            entry: input.entry,
        }
    },
};

const getTime = () =>new Date(Date.now()).getTime();

const getFiveMinutesAgo = () => getTime() - 60000 * 5;

const addTransaction= table => (userId:string, quantity:number) => new Promise((resolve, reject) => {
    table.insert(DTO.toPostgres({userId,entry:quantity,timestamp:getTime()}))
        .then(()=> {return;})
});

const sumEntriesByUserId = table => (userId:string) =>
    new Promise((resolve: (*) => void, reject) => {
        table
            .sum('entry')
            .where('userId', userId)
            .then((result) => { return Number(result.sum || 0); })
            .then(resolve)
            .catch(reject);
    });

const canCheckIn = table => (userId:string) =>
    new Promise((resolve: (*) => void, reject) => {
        table
            .where('userId', userId)
            .whereBetween('created_at', [getFiveMinutesAgo(), getTime()])
            .then(results => {
                console.log(results)
                if(results.length)
                    return false;
                else
                    return true;
            })
            .then(resolve)
            .catch(reject);
    });

const getCheckIns = table => (userId:string) =>
    new Promise((resolve, reject) => {
        table
            .where('userId', userId)
            .then(input => {
                if (!input) {
                    return [];
                }
                return input.map(DTO.fromPostgres);
            })
            .then(resolve)
            .catch(reject)
    });

class PointsDAO {
    addTransaction: (userId:string, quantity:number) => Promise<void>;
    sumEntriesByUserId: (id:string) => Promise<number>;
    canCheckIn: (id:string) => Promise<boolean>;
    getCheckIns: (id:string) => Promise<Array<{id: string, userId:string, entry:number}>>;

    constructor(knex: Knex) {
        const table = knex(`points`);

        this.sumEntriesByUserId = sumEntriesByUserId(table);
        this.addTransaction = addTransaction(table);
        this.canCheckIn = canCheckIn(table);
        this.getCheckIns = getCheckIns(table);
    }
}

export default PointsDAO;
