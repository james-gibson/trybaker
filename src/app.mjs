// @flow
import Server from './server.mjs';
import DataProvider from './services/data/dataProvider.mjs';

const start = () => {
    DataProvider.init().then(dataProvider => {
        new Server(dataProvider);
    });
};

export default { launch: start}
