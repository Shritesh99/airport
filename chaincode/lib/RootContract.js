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
                    Buffer.from(JSON.stringify(CONSTANTS.STATEIDS))
                );
            } else if (v[i] === CONSTANTS.DB.PERSON) {
                await ctx.stub.putState(
                    v[i],
                    Buffer.from(JSON.stringify([env.admin.id]))
                );
            } else if (v[i] === CONSTANTS.DB.ADDRESS) {
                await ctx.stub.putState(
                    v[i],
                    Buffer.from(JSON.stringify([env.RegionalofficeAddress.id]))
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
        await ctx.stub.putState(
            `${CONSTANTS.DB.PERSON}-${env.admin.id}`,
            Buffer.from(JSON.stringify(env.admin))
        );
        await ctx.stub.putState(
            `${CONSTANTS.DB.ADDRESS}-${env.RegionalofficeAddress.id}`,
            Buffer.from(JSON.stringify(env.RegionalofficeAddress))
        );
        for (let i = 0; i < CONSTANTS.STATEIDS.length; i++) {
            await ctx.stub.putState(
                `${CONSTANTS.DB.STATE}-${CONSTANTS.STATEIDS[i]}`,
                Buffer.from(JSON.stringify(CONSTANTS.STATES[i]))
            );
        }
    }
}
module.exports = RootContract;
