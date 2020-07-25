"use strict";

const admin = [
    {
        id: "35149e74-b256-40b9-aaa9-a47e2af54a1b",
        name: "Adam",
        email: "admin",
        role: "Admin",
        password:
            "$2b$12$z6fhup0N0DqDap9DPkli9uFM/HcsXVXB2LGJJrPLPCCKZzPssQSgO",
    },
];

const Regionaloffice = {
    address: "a0015283-58ee-4449-809c-de85a2c915fb",
    head: "",
    inspectors: [],
    licenses: [],
    operators: [],
};
const RegionalofficeAddress = [
    {
        id: "a0015283-58ee-4449-809c-de85a2c915fb",
        line1: "Bade W ke niche",
        line2: "St Sebastian Garden",
        city: "Panaji",
        state: "392650b0-1ec6-48ad-9e7f-17645c22b14e",
        pinCode: 490006,
    },
];

module.exports = {
    admin,
    Regionaloffice,
    RegionalofficeAddress,
};
