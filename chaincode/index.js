'use strict';

const RootContract = require('./lib/RootContract');
const LicenseContract = require('./lib/LicenseContract');
const StateContract = require('./lib/StateContract');

module.exports.RootContract = RootContract;
module.exports.LicenseContract = LicenseContract;
module.exports.StateContract = StateContract;
module.exports.contracts = [ RootContract, StateContract, LicenseContract ];
