'use strict';

const { Contract } = require('fabric-contract-api');

const { CONSTANTS, Helper } = require('./utils');
const AddressContract = require('./AddressContract');

class PersonContract extends Contract{
    async getUserById(ctx, id){
        if(id) {
            const user = await Helper.getById(ctx, CONSTANTS.DB.PERSON, id);
            if(user.address) {
                const address = new AddressContract();
                user.address = JSON.parse(await address.getAddressByID(ctx, user.address));
            }
            return JSON.stringify(user);
        }else {
            throw new Error('No id provided');
        }
    }

    async getUserByEmail(ctx, email){
        if(email) {
            const user = await Helper.getByField(ctx, CONSTANTS.DB.PERSON, 'email', email);
            if(user.address) {
                const addressC = new AddressContract();
                const address = await addressC.getAddressByID(ctx, user.address);
                user.address = JSON.parse(address);
            }
            return JSON.stringify(user);
        }else {
            throw new Error('No email provided');
        }
    }

    async createUser(ctx, name, email, password, phone, role, signImage, govtId, aid,line1, line2, city, state, pinCode){
        const user = await Helper.getByField(ctx, CONSTANTS.DB.PERSON, email);
        if(!Object.keys(user).length > 0) {
            const addressContract = new AddressContract();
            const address = JSON.parse(await addressContract.createAddress(ctx, aid, line1, line2, city, state, pinCode));
            const item = {
                name,
                email,
                password,
                phone,
                role,
                signImage,
                govtId,
                address: address.id
            };
            await Helper.createItem(ctx, CONSTANTS.DB.PERSON, item);
            return JSON.stringify(item);
        }else{
            throw new Error('User already exist');
        }
    }
}
module.exports = PersonContract;
