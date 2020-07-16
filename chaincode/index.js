'use strict';

const RootContract = require('./lib/RootContract');
const StateContract = require('./lib/StateContract');
const AddressContract = require('./lib/AddressContract');
const PersonContract = require('./lib/PersonContract');
const LicenseContract = require('./lib/LicenseContract');

module.exports.RootContract = RootContract;
module.exports.StateContract = StateContract;
module.exports.AddressContract = AddressContract;
module.exports.PersonContract = AddressContract;
module.exports.LicenseContract = LicenseContract;
module.exports.contracts = [ RootContract, StateContract, AddressContract, PersonContract, LicenseContract ];
