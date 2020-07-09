'use strict';

const LicenseContract = require('./lib/License');
const StateContract = require('./lib/State');

module.exports.licenseContract = LicenseContract;
module.exports.StateContract = StateContract;
module.exports.contracts = [ StateContract, LicenseContract ];
