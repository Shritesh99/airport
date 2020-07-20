'use strict';
// Keys
const STATE = 'state';
const ADDRESS = 'address';
const PERSON = 'person';
const LICENSE = 'license';

const STATESARR = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttarakhand',
    'Uttar Pradesh',
    'West Bengal',
];

const STATEIDS = [
    'acbb8976-b0c3-45d0-a312-cb3f568c7c48',
    '91bf8355-4ec3-4f8e-a178-14b6b1d9f3da',
    'cda7fe6b-5e2c-44f5-b9cc-67fb45a0bed5',
    'ab0dcdeb-c5ad-4a0b-9edf-42c6a45a5625',
    '0c8e0c47-d651-4e97-a05c-f95173b22dcb',
    '392650b0-1ec6-48ad-9e7f-17645c22b14e',
    '6c836080-106c-41e0-a20f-f393b09545c4',
    '9e6cfe0c-8529-4b3a-b992-1bffe93cb433',
    'fa1ffbd4-365d-4a86-837b-55e0165d1c09',
    'b983903b-fef2-4638-b5fe-1928d20b28aa',
    '75827a4d-e0fe-4a17-9ffa-c65f52d7febb',
    '59ea5cab-fa73-4dcf-b58f-e785eea05812',
    'd0ba2762-59ad-4d80-be86-1df2fdb61a97',
    '5f25d2c1-3d3d-4b3f-a603-fb808deada80',
    'd1cc68d4-e9e6-4b7e-a53d-d1f08646c25a',
    'a018daca-5dfe-4d1c-9683-eacea0928a5a',
    'ebaced86-9c27-45fe-ba87-f851c78e45ac',
    '6a197afd-6142-4591-b74a-0d4fc349a181',
    'c3dcaa70-2059-4a49-ab66-288c1be99359',
    '6af0c461-748f-4075-9545-a4496fda4ad0',
    '8ce810b1-3be8-42d3-a723-9f07e1793958',
    '3f867dfa-b433-481d-b510-f2d3e139d136',
    '359b997d-9ca7-479c-9bb6-fcd3372695d6',
    '8bdf49e4-3a73-4b2e-84aa-25109d3764d8',
    'd21cb052-1808-4773-8489-5900acb64d15',
    '28bf2657-0966-42a1-80da-de7bd1e7f69b',
    'a35560a5-e6e1-4dd5-b050-dfa5fa378e74',
    '7f7c448a-28a4-4d91-a3c7-fdfbe4106156',
];

const STATES = [];
STATESARR.forEach((v,i) => {
    const item = {
        id: STATEIDS[i],
        state: v,
        country: 'India'
    };
    STATES.push(item);
});

const DB = {
    STATE,
    ADDRESS,
    PERSON,
    LICENSE,
};
module.exports = {
    DB,
    STATES,
};
