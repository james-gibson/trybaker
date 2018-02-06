// @flow
import Server from './server.mjs';
import DataProvider from './services/data/dataProvider.mjs';

const launch = () => {
    DataProvider.init().then(dataProvider => {
        new Server(dataProvider);
    });
};

export default { launch }
