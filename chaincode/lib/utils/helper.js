"use strict";

const checkIdExist = async (ctx, db, id) => {
    const ins = await ctx.stub.getState(db);
    const json = JSON.parse(ins.toString());
    return json.includes(id);
};

const getItemById = async (ctx, db, id) => {
    const exist = await checkIdExist(ctx, db, id);
    if (exist) {
        const itemB = await ctx.stub.getState(`${db}-${id}`);
        return JSON.parse(itemB.toString());
    } else {
        throw new Error("No Id exist");
    }
};

const getByField = async (ctx, db, field, item) => {
    const ins = await ctx.stub.getState(db);
    const json = JSON.parse(ins.toString());
    let itemR = {};
    for await (const element of json) {
        const insO = await ctx.stub.getState(`${db}-${element}`);
        const jsonO = JSON.parse(insO.toString());
        if (jsonO[field] === item) {
            itemR = jsonO;
        }
    }
    return Object.keys(itemR).length > 0 ? itemR : false;
};

const getItemsByField = async (ctx, db, field, item) => {
    const ins = await ctx.stub.getState(db);
    const json = JSON.parse(ins.toString());
    let itemR = [];
    for await (const element of json) {
        const insO = await ctx.stub.getState(`${db}-${element}`);
        const jsonO = JSON.parse(insO.toString());
        if (json[field] === item) {
            itemR.push(jsonO);
        }
    }
    return itemR;
};

const createItem = async (ctx, db, item) => {
    const ins = await ctx.stub.getState(db);
    const json = JSON.parse(ins.toString());
    json.push(item.id);
    await ctx.stub.putState(db, Buffer.from(JSON.stringify(json)));
    await ctx.stub.putState(
        `${db}-${item.id}`,
        Buffer.from(JSON.stringify(item))
    );
};

const updateItem = async (ctx, db, id, item) => {
    const exist = await checkIdExist(id);
    if (exist) {
        await ctx.stub.putState(
            `${db}-${id}`,
            Buffer.from(JSON.stringify(item))
        );
    } else {
        throw new Error("No Id exist");
    }
};
const getHistory = async (ctx, db, id) => {
    let iterator = ctx.stub.getHistoryForKey(`${db}-${id}`);
    const results = [];
    for await (const keyMod of iterator) {
        const resp = {
            timestamp: keyMod.timestamp,
            txid: keyMod.tx_id,
        };
        if (keyMod.is_delete) {
            resp.data = "KEY DELETED";
        } else {
            resp.data = keyMod.value.toString("utf8");
        }
        results.push(resp);
    }
    return JSON.stringify(results);
};

module.exports = {
    checkIdExist,
    getItemById,
    getByField,
    getItemsByField,
    createItem,
    updateItem,
    getHistory,
};
