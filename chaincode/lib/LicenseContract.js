"use strict";

const { Contract } = require("fabric-contract-api");

const { CONSTANTS, Helper } = require("./utils");
const AddressContract = require("./AddressContract");

class LicenseContract extends Contract {
    async getLicenseById(ctx, id) {
        if (id) {
            const license = await Helper.getById(ctx, CONSTANTS.DB.LICENSE, id);
            const user = await Helper.getById(
                ctx,
                CONSTANTS.DB.PERSON,
                license.operator
            );
            if (user.address) {
                const address = new AddressContract();
                user.address = JSON.parse(
                    await address.getAddressByID(ctx, user.address)
                );
            }
            license.operator = user;
            return JSON.stringify(license);
        } else {
            throw new Error("No id provided");
        }
    }
    async updateLicenseStatus(ctx, id, status) {
        const license = await Helper.getById(ctx, CONSTANTS.DB.LICENSE, id);
        if (Object.keys(id).length > 0) {
            license.status = status;
            await Helper.updateItem(ctx, CONSTANTS.DB.LICENSE, id, license);
        } else {
            throw new Error("License not found");
        }
    }

    async createLicense(ctx, id, oId, data) {
        const jsonP = Helper.getById(ctx, CONSTANTS.DB.PERSON, oId);
        if (Object.keys(jsonP).length > 0) {
            jsonP.licenses.push(id);
            await Helper.updateItem(ctx, CONSTANTS.DB.PERSON, oId, jsonP);
            const insRO = await ctx.stub.getState(CONSTANTS.DB.REGIONALOFFICE);
            const jsonRO = JSON.parse(insRO.toString());
            jsonRO.licenses.push(id);
            await ctx.stub.putState(
                CONSTANTS.DB.REGIONALOFFICE,
                Buffer.from(JSON.stringify(jsonRO))
            );
            const json = JSON.parse(data);
            json.status = CONSTANTS.FORMSTATUS.Submitted;
            const item = { id, operator: oId };
            item.form1 = json;
            await Helper.createItem(ctx, CONSTANTS.DB.LICENSE, item);
        } else {
            throw new Error("Operator not Exist");
        }
    }

    async saveForm(ctx, id, form, data) {
        const json = JSON.parse(data);
        json.status = CONSTANTS.FORMSTATUS.Submitted;
        const license = await Helper.getById(ctx, CONSTANTS.DB.LICENSE, id);
        if (Object.keys(id).length > 0) {
            license[form] = json;
            await Helper.updateItem(ctx, CONSTANTS.DB.LICENSE, id, license);
        } else {
            throw new Error("License not found");
        }
    }

    async updateForm(ctx, id, form, data) {
        const json = JSON.parse(data);
        json.status = CONSTANTS.FORMSTATUS.Edited;
        const license = await Helper.getById(ctx, CONSTANTS.DB.LICENSE, id);
        if (Object.keys(id).length > 0) {
            license[form] = json;
            await Helper.updateItem(ctx, CONSTANTS.DB.LICENSE, id, license);
        } else {
            throw new Error("License not found");
        }
    }

    async updateFormByReviewer(ctx, id, data, form, status) {
        const json = JSON.parse(data);
        json.status = status;
        const license = await Helper.getById(ctx, CONSTANTS.DB.LICENSE, id);
        if (Object.keys(id).length > 0) {
            license[form] = json;
            await Helper.updateItem(ctx, CONSTANTS.DB.LICENSE, id, license);
        } else {
            throw new Error("License not found");
        }
    }
}
module.exports = LicenseContract;
