'use strict';

const { Contract } = require('fabric-contract-api');

const { CONSTANTS } = require('./utils');

class RootContract extends Contract {
    async initLedger(ctx) {
        await Object.values(CONSTANTS.DB).forEach(async v => {
            await this.ctx.putState(v, Buffer.from(JSON.stringify([])));
        });
    }
}
module.exports = RootContract;
