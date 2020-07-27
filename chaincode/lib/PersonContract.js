"use strict";

const { Contract } = require("fabric-contract-api");

const { CONSTANTS, Helper } = require("./utils");
const AddressContract = require("./AddressContract");

class PersonContract extends Contract {
    async getUserById(ctx, id) {
        const user = await Helper.getItemById(ctx, CONSTANTS.DB.PERSON, id);
        if (user.address) {
            const address = new AddressContract();
            user.address = JSON.parse(
                await address.getAddressByID(ctx, user.address)
            );
        }
        return JSON.stringify(user);
    }

    async getUserByEmail(ctx, email) {
        const user = await Helper.getByField(
            ctx,
            CONSTANTS.DB.PERSON,
            "email",
            email
        );
        if (user) {
            if (user.address) {
                const addressC = new AddressContract();
                const address = await addressC.getAddressByID(
                    ctx,
                    user.address
                );
                user.address = JSON.parse(address);
            }
            return JSON.stringify(user);
        } else {
            throw new Error("No user exist");
        }
    }

    async getUsersByRoles(ctx, role) {
        const users = await Helper.getItemsByField(
            ctx,
            CONSTANTS.DB.PERSON,
            "role",
            role
        );
        const addressC = new AddressContract();
        for await (const user of users) {
            if (user.address) {
                user.address = JSON.parse(
                    await addressC.getAddressByID(ctx, user.address)
                );
            }
        }
        return JSON.stringify(users);
    }

    async createUser(
        ctx,
        id,
        name,
        email,
        password,
        phone,
        role,
        signImage,
        govtId,
        aid,
        line1,
        line2,
        city,
        state,
        pinCode
    ) {
        const addressContract = new AddressContract();
        const dataAddress = {
            id: aid,
            line1,
            line2,
            city,
            state,
            pinCode,
        };
        const address = JSON.parse(
            await addressContract.createAddress(
                ctx,
                JSON.stringify(dataAddress)
            )
        );
        const item = {
            id,
            name,
            email,
            password,
            phone,
            role,
            signImage,
            govtId,
            address: address.id,
        };
        if (role === CONSTANTS.ROLES.RegionalOfficeHead) {
            const ins = await ctx.stub.getState(CONSTANTS.DB.REGIONALOFFICE);
            const item = ins.toString();
            const json = JSON.parse(item);
            json.head = id;
            await ctx.stub.putState(
                CONSTANTS.DB.REGIONALOFFICE,
                Buffer.from(JSON.stringify(json))
            );
        } else if (role === CONSTANTS.ROLES.AerodromeInspector) {
            const ins = await ctx.stub.getState(CONSTANTS.DB.REGIONALOFFICE);
            const item = ins.toString();
            const json = JSON.parse(item);
            json.inspectors.push(id);
            await ctx.stub.putState(
                CONSTANTS.DB.REGIONALOFFICE,
                Buffer.from(JSON.stringify(json))
            );
            item.licenses = [];
        } else if (role === CONSTANTS.ROLES.Operator) {
            const ins = await ctx.stub.getState(CONSTANTS.DB.REGIONALOFFICE);
            const item = ins.toString();
            const json = JSON.parse(item);
            json.operators.push(id);
            await ctx.stub.putState(
                CONSTANTS.DB.REGIONALOFFICE,
                Buffer.from(JSON.stringify(json))
            );
            item.licenses = [];
        }
        await Helper.createItem(ctx, CONSTANTS.DB.PERSON, item);
        item.address = address;
        return JSON.stringify(item);
    }

    async getHistory(ctx, id) {
        return await Helper.getHistory(ctx, CONSTANTS.DB.PERSON, id);
    }
}
module.exports = PersonContract;
