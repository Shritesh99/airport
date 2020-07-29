"use strict";

const { Contract } = require("fabric-contract-api");
const PersonContract = require("./PersonContract");
const { CONSTANTS, Helper } = require("./utils");

class LicenseContract extends Contract {
    async getLicenseById(ctx, id) {
        const license = await Helper.getItemById(ctx, CONSTANTS.DB.LICENSE, id);
        const personC = new PersonContract();
        if (license.aerodrome.owner) {
            const owner = await personC.getUserById(
                ctx,
                license.aerodrome.owner
            );
            license.aerodrome.owner = JSON.parse(owner);
        }
        if (license.operator) {
            const operator = await personC.getUserById(ctx, license.operator);
            license.operator = JSON.parse(operator);
        }
        if (license.inpector) {
            const inpector = await personC.getUserById(ctx, license.inpector);
            license.inpector = JSON.parse(inpector);
        }
        return JSON.stringify(license);
    }

    async updateLicenseStatus(ctx, id, status) {
        const license = await Helper.getItemById(ctx, CONSTANTS.DB.LICENSE, id);
        license.status = status;
        await Helper.updateItem(ctx, CONSTANTS.DB.LICENSE, id, license);
        ctx.stub.setEvent(
            `${CONSTANTS.LICENSESTATUS}-${id}`,
            Buffer.from(JSON.stringify(license))
        );
    }

    async assignInspector(ctx, id, iid) {
        const personC = new PersonContract();
        const jsonP = JSON.parse(await personC.getUserById(ctx, iid));
        const license = await Helper.getItemById(ctx, CONSTANTS.DB.LICENSE, id);
        jsonP.licenses.push(id);
        await Helper.updateItem(ctx, CONSTANTS.DB.PERSON, iid, jsonP);
        license.inspector = iid;
        await Helper.updateItem(ctx, CONSTANTS.DB.LICENSE, id, license);
    }

    async createLicense(ctx, id, oId, data) {
        const json = JSON.parse(data);
        json.status = CONSTANTS.FORMSTATUS.Submitted;
        const item = {
            id,
            aerodrome: json,
            operator: oId,
            status: CONSTANTS.LICENSESTATUS.Waiting_For_Data,
        };
        await Helper.createItem(ctx, CONSTANTS.DB.LICENSE, item);

        const personC = new PersonContract();
        const jsonP = JSON.parse(await personC.getUserById(ctx, oId));
        jsonP.licenses.push(id);
        await Helper.updateItem(ctx, CONSTANTS.DB.PERSON, oId, jsonP);

        const insRO = await ctx.stub.getState(CONSTANTS.DB.REGIONALOFFICE);
        const jsonRO = JSON.parse(insRO.toString());
        jsonRO.licenses.push(id);
        await ctx.stub.putState(
            CONSTANTS.DB.REGIONALOFFICE,
            Buffer.from(JSON.stringify(jsonRO))
        );
        ctx.stub.setEvent(
            `${CONSTANTS.LICENSESTATUS}-${id}`,
            Buffer.from(JSON.stringify(item))
        );
    }

    async saveForm(ctx, id, form, data) {
        const json = JSON.parse(data);
        json.status = CONSTANTS.FORMSTATUS.Submitted;
        const license = await Helper.getItemById(ctx, CONSTANTS.DB.LICENSE, id);
        license[form] = json;
        await Helper.updateItem(ctx, CONSTANTS.DB.LICENSE, id, license);
    }

    async updateForm(ctx, id, form, data) {
        const json = JSON.parse(data);
        json.status = CONSTANTS.FORMSTATUS.Edited;
        const license = await Helper.getItemById(ctx, CONSTANTS.DB.LICENSE, id);
        license[form] = json;
        await Helper.updateItem(ctx, CONSTANTS.DB.LICENSE, id, license);
    }

    async updateFormByReviewer(ctx, id, form, data, status) {
        const json = JSON.parse(data);
        json.status = status;
        const license = await Helper.getItemById(ctx, CONSTANTS.DB.LICENSE, id);
        license[form] = json;
        await Helper.updateItem(ctx, CONSTANTS.DB.LICENSE, id, license);
    }

    async getAllLicensesForStatus(ctx, status) {
        const licenseR = await Helper.getItemsByField(
            ctx,
            CONSTANTS.DB.LICENSE,
            "status",
            status
        );
        const result = [];
        for await (const e of licenseR) {
            const license = await this.getLicenseById(e.id);
            result.push(JSON.parse(license));
        }
        return JSON.stringify(result);
    }

    async getAllLicensesForOperator(ctx, oid) {
        const licenseR = await Helper.getItemsByField(
            ctx,
            CONSTANTS.DB.LICENSE,
            "operator",
            oid
        );
        const result = [];
        for await (const e of licenseR) {
            const license = await this.getLicenseById(e.id);
            result.push(JSON.parse(license));
        }
        return JSON.stringify(result);
    }

    async getAllLicensesForInpector(ctx, iid) {
        const licenseR = await Helper.getItemsByField(
            ctx,
            CONSTANTS.DB.LICENSE,
            "inspector",
            iid
        );
        const result = [];
        for await (const e of licenseR) {
            const license = await this.getLicenseById(e.id);
            result.push(JSON.parse(license));
        }
        return JSON.stringify(result);
    }

    async getAllLicenses(ctx) {
        const ins = await ctx.stub.getState(CONSTANTS.DB.LICENSE);
        const json = JSON.parse(ins.toString());
        const arr = [];
        for await (const element of json) {
            const insO = await ctx.stub.getState(
                `${CONSTANTS.DB.LICENSE}-${element}`
            );
            const jsonO = JSON.parse(insO.toString());
            arr.push(jsonO);
        }
        return JSON.stringify(arr);
    }
    async generateLicense(ctx, id, url, expiry, date) {
        const license = await Helper.getItemById(ctx, CONSTANTS.DB.LICENSE, id);
        license.license = url;
        license.expiry = expiry;
        license.dateOfIssue = date;
        await Helper.updateItem(ctx, CONSTANTS.DB.LICENSE, id, license);
        return JSON.stringify(license);
    }
    // async renewLicense(ctx, id, renewData) {
    //     const license = await Helper.getItemById(ctx, CONSTANTS.DB.LICENSE, id);
    //     license.renew
    //         ? license.renew.push(JSON.parse(renewData))
    //         : (license.renew = [JSON.parse(renewData)]);
    //     await Helper.updateItem(ctx, CONSTANTS.DB.LICENSE, id, license);
    //     return JSON.stringify(license);
    // }
    async getHistory(ctx, id) {
        return await Helper.getHistory(ctx, CONSTANTS.DB.LICENSE, id);
    }
}
module.exports = LicenseContract;
