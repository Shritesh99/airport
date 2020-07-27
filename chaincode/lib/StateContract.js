"use strict";

const { Contract } = require("fabric-contract-api");

const { CONSTANTS, Helper } = require("./utils");

class StateContract extends Contract {
    async getStatebyID(ctx, id) {
        const state = await Helper.getItemById(ctx, CONSTANTS.DB.STATE, id);
        return JSON.stringify(state);
    }
    async getStatebyName(ctx, state) {
        const stateR = await Helper.getByField(
            ctx,
            CONSTANTS.DB.STATE,
            "state",
            state
        );
        if (stateR) {
            return JSON.stringify(stateR);
        } else {
            throw new Error("No State Exist");
        }
    }
    async createState(ctx, data) {
        const dataJson = JSON.parse(data);
        const stateR = await Helper.getByField(
            ctx,
            CONSTANTS.DB.STATE,
            "state",
            dataJson.state
        );
        if (stateR) {
            return JSON.stringify(stateR);
        } else {
            await Helper.createItem(ctx, CONSTANTS.DB.STATE, dataJson);
            return JSON.stringify(dataJson);
        }
    }
    async getAllStates(ctx) {
        const ins = await ctx.stub.getState(CONSTANTS.DB.STATE);
        const json = JSON.parse(ins.toString());
        const arr = [];
        for await (const element of json) {
            const insO = await ctx.stub.getState(
                `${CONSTANTS.DB.STATE}-${element}`
            );
            const jsonO = JSON.parse(insO.toString());
            arr.push(jsonO);
        }
        return JSON.stringify(arr);
    }
    async getHistory(ctx, id) {
        return await Helper.getHistory(ctx, CONSTANTS.DB.STATE, id);
    }
}
module.exports = StateContract;
