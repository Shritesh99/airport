"use strict";

const { Contract } = require("fabric-contract-api");

const { CONSTANTS } = require("./utils");
const AddressContract = require("./AddressContract");
const PersonContract = require("./PersonContract");
const LicenseContract = require("./LicenseContract");

class RegionalOfficeContract extends Contract {
    async getOffice(ctx) {
        const ins = await ctx.stub.getState(CONSTANTS.DB.REGIONALOFFICE);
        const item = ins.toString();
        const json = JSON.parse(item);
        const addressC = new AddressContract();
        const address = await addressC.getAddressByID(ctx, json.address);
        json.address = JSON.parse(address);
        const personC = new PersonContract();
        const person = await personC.getUserById(ctx, json.head);
        json.head = JSON.parse(person);
        const insp = [];
        json.inspectors.forEach(async (e) => {
            const p = await personC.getUserById(ctx, e);
            insp.push(JSON.parse(p));
        });
        json.inspectors = insp;
        const operators = [];
        json.operators.forEach(async (e) => {
            const p = await personC.getUserById(ctx, e);
            operators.push(JSON.parse(p));
        });
        json.operators = operators;
        const licenseC = new LicenseContract();
        const licenses = [];
        json.licenses.forEach(async (v) => {
            const l = await licenseC.getLicenseById(ctx, v);
            licenses.push(JSON.parse(l));
        });
        json.licenses = licenses;
        return json.stringify(json);
    }
}
module.exports = RegionalOfficeContract;
