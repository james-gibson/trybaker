//@flow
import PointsDAO from './data/dao/PointsDao.mjs';
import User from '../models/User.mjs';
import type {DataProvider} from './data/dataProvider.mjs';
import PROVIDERS from './data/providers/providerEnum.mjs';


const checkIn = dataProvider => (userId:string, qty:number) => {
    const sendgridProvider =dataProvider.get(PROVIDERS.SENDGRID);
    const pointsDAO = new PointsDAO(dataProvider.get(PROVIDERS.POSTGRES));

    return pointsDAO.canCheckIn(userId)
        .then((canCheckIn:boolean) => {
            if(!canCheckIn) { throw new Error('Its too soon to check in')}

            return pointsDAO.sumEntriesByUserId(userId).then((pointSum:number) => {
                let subTotal = pointSum + qty;
                console.log('send email here', subTotal);
                pointsDAO.addTransaction(userId,qty);
            })
        })
};

const getReportByUserId =
    (dao:PointsDAO) =>
        (userId:string) =>
            dao.getCheckIns(userId)
                .then((results:Array<{id: string, userId:string, entry:number}>) => {
                    const result = {
                        total: 0,
                        entries: results,
                    };

                    results.map((x) => {
                        result.total += x.entry;
                    });

                    return result;
                });


class PointsService {
    checkIn: (userId:string, qty:number) => Promise<void>;
    report: (userId:string) => Promise<{total:number, entries:Array<{id: string, userId:string, entry:number}>}>;
    constructor(dataProvider: DataProvider) {

        this.checkIn = checkIn(dataProvider);
        this.report = getReportByUserId(new PointsDAO(dataProvider.get(PROVIDERS.POSTGRES)));
    }
}

export default PointsService;