'use strict';

const { Contract } = require('fabric-contract-api');

const { CONSTANTS, Helper } = require('./utils');

class StateContract extends Contract {
    async getStatebyID(ctx, id) {
        if (id) {
            const state = await Helper.getById(ctx, CONSTANTS.DB.STATE, id);
            return JSON.stringify(state);
        } else {
            throw new Error('No id exist');
        }
    }
    async getStatebyName(ctx, state) {
        if (state) {
            const stateR = await Helper.getByField(
                ctx,
                CONSTANTS.DB.STATE,
                'state',
                state
            );
            return JSON.stringify(stateR);
        } else {
            throw new Error('No matching state');
        }
    }
    async createState(ctx, id, state, country) {
        const stateR = await Helper.getByField(
            ctx,
            CONSTANTS.DB.STATE,
            'state',
            state
        );
        if (!Object.keys(stateR).length > 0) {
            const item = { id, state, country };
            await Helper.createItem(ctx, CONSTANTS.DB.STATE, item);
            return JSON.stringify(item);
        } else {
            return JSON.stringify(stateR);
        }
    }
    async getAllStates(ctx) {
        const stateIns = await ctx.stub.getState(CONSTANTS.DB.STATE);
        return stateIns.toString();
    }
}
module.exports = StateContract;
