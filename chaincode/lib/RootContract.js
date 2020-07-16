'use strict';

const { Contract } = require('fabric-contract-api');
const { CONSTANTS } = require('./utils');

class RootContract extends Contract {
    async initLedger(ctx) {
        const v = Object.values(CONSTANTS.DB);
        for (let i = 0; i < v.length; i++){
            if(v[i] === CONSTANTS.DB.STATE) {
                await ctx.stub.putState(v[i], Buffer.from(JSON.stringify(CONSTANTS.STATES)));
            }
            else if(v[i] === CONSTANTS.DB.PERSON) {
                const arr = [
                    {
                        id: '35149e74-b256-40b9-aaa9-a47e2af54a1b',
                        name: 'Adam',
                        email: 'admin',
                        role: 'Admin',
                        password: '$2b$12$z6fhup0N0DqDap9DPkli9uFM/HcsXVXB2LGJJrPLPCCKZzPssQSgO'
                    },
                ];
                await ctx.stub.putState(v[i], Buffer.from(JSON.stringify(arr)));
            } else {
                await ctx.stub.putState(v[i], Buffer.from(JSON.stringify([])));
            }
        }
    }
}
module.exports = RootContract;
