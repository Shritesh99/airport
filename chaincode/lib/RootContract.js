"use strict";

const { Contract } = require("fabric-contract-api");
const { CONSTANTS } = require("./utils");
const env = require("./env");

class RootContract extends Contract {
    async initLedger(ctx) {
        const v = Object.values(CONSTANTS.DB);
        for (let i = 0; i < v.length; i++) {
            if (v[i] === CONSTANTS.DB.STATE) {
                await ctx.stub.putState(
                    v[i],
                    Buffer.from(JSON.stringify(CONSTANTS.STATES))
                );
            } else if (v[i] === CONSTANTS.DB.PERSON) {
                await ctx.stub.putState(
                    v[i],
                    Buffer.from(JSON.stringify(env.admin))
                );
            } else if (v[i] === CONSTANTS.DB.ADDRESS) {
                await ctx.stub.putState(
                    v[i],
                    Buffer.from(JSON.stringify(env.RegionalofficeAddress))
                );
            } else if (v[i] === CONSTANTS.DB.REGIONALOFFICE) {
                await ctx.stub.putState(
                    v[i],
                    Buffer.from(JSON.stringify(env.Regionaloffice))
                );
            } else {
                await ctx.stub.putState(v[i], Buffer.from(JSON.stringify([])));
            }
        }
    }
}
module.exports = RootContract;
