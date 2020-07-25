"use strict";

const { Contract } = require("fabric-contract-api");

const { CONSTANTS, Helper } = require("./utils");
const AddressContract = require("./AddressContract");
const LicenseContract = require("./LicenseContract");

class PersonContract extends Contract {
    async getUserById(ctx, id) {
        if (id) {
            const user = await Helper.getById(ctx, CONSTANTS.DB.PERSON, id);
            if (user.address) {
                const address = new AddressContract();
                user.address = JSON.parse(
                    await address.getAddressByID(ctx, user.address)
                );
            }
            if (user.licenses) {
                const licenseC = new LicenseContract();
                const licenses = [];
                user.licenses.forEach(async (v) => {
                    const license = JSON.parse(
                        await licenseC.getLicenseById(v)
                    );
                    licenses.push(license);
                });
                user.license = licenses;
            }
            return JSON.stringify(user);
        } else {
            throw new Error("No id provided");
        }
    }

    async getUserByEmail(ctx, email) {
        if (email) {
            const user = await Helper.getByField(
                ctx,
                CONSTANTS.DB.PERSON,
                "email",
                email
            );
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
            throw new Error("No email provided");
        }
    }

    async getUsersByRoles(ctx, role) {
        if (role) {
            const users = await Helper.getItemsByField(
                ctx,
                CONSTANTS.DB.PERSON,
                "role",
                role
            );
            const addressC = new AddressContract();
            users.forEach(async (user) => {
                if (user.address) {
                    user.address = JSON.parse(
                        await addressC.getAddressByID(ctx, user.address)
                    );
                }
            });
            return JSON.stringify(users);
        } else {
            throw new Error("No role provided");
        }
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
        const user = await Helper.getByField(
            ctx,
            CONSTANTS.DB.PERSON,
            "email",
            email
        );
        if (!(Object.keys(user).length > 0)) {
            if (role === CONSTANTS.ROLES.RegionalOfficeHead) {
                const ins = await ctx.stub.getState(
                    CONSTANTS.DB.REGIONALOFFICE
                );
                const item = ins.toString();
                const json = JSON.parse(item);
                json.head = id;
                await ctx.stub.putState(
                    CONSTANTS.DB.REGIONALOFFICE,
                    Buffer.from(JSON.stringify(json))
                );
            } else if (role === CONSTANTS.ROLES.AerodromeInspector) {
                const ins = await ctx.stub.getState(
                    CONSTANTS.DB.REGIONALOFFICE
                );
                const item = ins.toString();
                const json = JSON.parse(item);
                json.inspectors.push(id);
                await ctx.stub.putState(
                    CONSTANTS.DB.REGIONALOFFICE,
                    Buffer.from(JSON.stringify(json))
                );
            } else if (role === CONSTANTS.ROLES.Operator) {
                const ins = await ctx.stub.getState(
                    CONSTANTS.DB.REGIONALOFFICE
                );
                const item = ins.toString();
                const json = JSON.parse(item);
                json.operators.push(id);
                await ctx.stub.putState(
                    CONSTANTS.DB.REGIONALOFFICE,
                    Buffer.from(JSON.stringify(json))
                );
            }
            const addressContract = new AddressContract();
            const address = JSON.parse(
                await addressContract.createAddress(
                    ctx,
                    aid,
                    line1,
                    line2,
                    city,
                    state,
                    pinCode
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
            await Helper.createItem(ctx, CONSTANTS.DB.PERSON, item);
            item.address = address;
            return JSON.stringify(item);
        } else {
            throw new Error("User already exist");
        }
    }
}
module.exports = PersonContract;
