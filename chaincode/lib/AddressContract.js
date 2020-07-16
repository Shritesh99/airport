'use strict';

const { Contract } = require('fabric-contract-api');

const { CONSTANTS, Helper } = require('./utils');

class AddressContract extends Contract {
    async getAddressByID(ctx, id){
        if(id) {
            const address = await  Helper.getById(ctx, CONSTANTS.DB.ADDRESS, id);
            if(Object.keys(address).length > 0){
                const state = await Helper.getById(ctx, CONSTANTS.DB.STATE, address.state);
                address.state = state;
                return JSON.stringify(address);
            }
        }
        else {
            throw new Error('No id provided');
        }
    }

    async createAddress(ctx, id, line1, line2, city, state, pinCode) {
        const stateR = await Helper.getByField(ctx, CONSTANTS.DB.STATE, 'state', state);
        if(Object.keys(stateR).length > 0) {
            const item = { id, line1, line2, city, state: stateR.id, pinCode };
            await Helper.createItem(ctx, CONSTANTS.DB.ADDRESS, item);
            return JSON.stringify(item);
        }else {
            throw new Error('No state exist');
        }
    }
}

module.exports = AddressContract;
