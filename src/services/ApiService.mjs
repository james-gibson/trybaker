//@flow
import {DataProvider} from "./data/dataProvider.mjs";

const verification = (dataProvider:DataProvider) => (type: 'EMAIL' | 'PHONE', value:string, code:string) => {
    console.log(type,value,code);

    return Promise.resolve({});
}

class ApiService {
    verify: (type: 'EMAIL' | 'PHONE', value:string, code:string) => Promise<*>;
    constructor(dataProvider:DataProvider) {
        this.verify = verification(dataProvider);
    }
}

export default ApiService;
