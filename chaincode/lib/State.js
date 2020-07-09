'use strict';

const { Contract } = require('fabric-contract-api');
const { v4 } = require('uuid');

const { CONSTANTS } = require('./utils');

class StateContract extends Contract {
    async getState(ctx, id = null, state = null){
        if(id) {
            const stateIns = await ctx.stub.getState(CONSTANTS.STATE);
            const stateArr = Buffer.from(stateIns).toString('utf8');
            const json = JSON.parse(stateArr);
            let item = {};
            json.forEach(element => {
                if (element.id === id) { item = element; }
            });
            return JSON.stringify(item);
        }else if(state) {
            const stateIns = await ctx.stub.getState(CONSTANTS.STATE);
            const stateArr = Buffer.from(stateIns).toString('utf8');
            const json = JSON.parse(stateArr);
            let item = {};
            json.forEach(element => {
                if (element.state === state) { item = element; }
            });
            return JSON.stringify(item);
        }else {
            throw new Error('No id or state');
        }
    }
    async setState(ctx, state, country){
        const id = v4();
        const item = { id, state, country };
        const stateIns = await ctx.stub.getState(CONSTANTS.STATE);
        if (!stateIns || stateIns.length === 0) {
            let arr  = [];
            arr.push(item);
            await ctx.stub.putState(CONSTANTS.STATE, Buffer.from(JSON.stringify(arr)));
        }else {
            const stateArr = Buffer.from(stateIns).toString('utf8');
            const json = JSON.parse(stateArr);
            json.push(item);
            await ctx.stub.putState(CONSTANTS.STATE, Buffer.from(JSON.stringify(json)));
        }
        return JSON.stringify(item);
    }
    async getAllStates(ctx) {
        const stateIns = await ctx.stub.getState(CONSTANTS.STATE);
        if (!stateIns || stateIns.length === 0) {
            throw new Error('There are no states.');
        }
        return Buffer.from(stateIns).toString('utf8');
    }
}
module.exports = StateContract;
