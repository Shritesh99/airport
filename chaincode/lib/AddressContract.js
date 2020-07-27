"use strict";

const { Contract } = require("fabric-contract-api");
const StateContract = require("./StateContract");
const { CONSTANTS, Helper } = require("./utils");

class AddressContract extends Contract {
    async getAddressByID(ctx, id) {
        const address = await Helper.getItemById(ctx, CONSTANTS.DB.ADDRESS, id);
        const stateC = new StateContract();
        address.state = JSON.parse(
            await stateC.getStatebyID(ctx, address.state)
        );
        return JSON.stringify(address);
    }

    async createAddress(ctx, dataJson) {
        const data = JSON.parse(dataJson);
        const stateC = new StateContract();
        const stateR = JSON.parse(await stateC.getStatebyName(ctx, data.state));
        const item = {
            id: data.id,
            line1: data.line1,
            line2: data.line2,
            city: data.city,
            state: stateR.id,
            pinCode: data.pinCode,
        };
        await Helper.createItem(ctx, CONSTANTS.DB.ADDRESS, item);
        item.state = stateR;
        return JSON.stringify(item);
    }

    async getHistory(ctx, id) {
        return await Helper.getHistory(ctx, CONSTANTS.DB.ADDRESS, id);
    }
}

module.exports = AddressContract;
