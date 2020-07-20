'use strict';

const getById = async (ctx, db, id) => {
    const ins = await ctx.stub.getState(db);
    const arr = ins.toString();
    const json = JSON.parse(arr);
    let item = {};
    json.forEach((element) => {
        if (element.id === id) {
            item = element;
        }
    });
    return item;
};

const getByField = async (ctx, db, field, item) => {
    const ins = await ctx.stub.getState(db);
    const arr = ins.toString();
    const json = JSON.parse(arr);
    let itemR = {};
    json.forEach((element) => {
        if (element[field] === item) {
            itemR = element;
        }
    });
    return itemR;
};
const createItem = async (ctx, db, item) => {
    const ins = await ctx.stub.getState(db);
    const arr = ins.toString();
    const json = JSON.parse(arr);
    json.push(item);
    await ctx.stub.putState(db, Buffer.from(JSON.stringify(json)));
};
module.exports = {
    getById,
    getByField,
    createItem,
};
