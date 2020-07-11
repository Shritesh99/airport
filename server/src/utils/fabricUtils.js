import { Gateway, Wallets } from 'fabric-network';
import dotenv from 'dotenv';
import { X509 } from './constants';
const profile = require('../../network-profile.json');

// Dotenv config
dotenv.config();
const {
    CHANNEL,
} = process.env;

let wallet = null;
let gateway = null;

const getNetworkfromAuth = async (auth) => {
    wallet = await Wallets.newInMemoryWallet();
    const x509Identity = {
        credentials: {
            certificate: auth.signCert,
            privateKey: auth.key,
        },
        mspId: auth.mspId,
        type: X509,
    };
    await wallet.put(auth.email, x509Identity);

    gateway = new Gateway();

    await gateway.connect(profile, { wallet, identity: auth.email, discovery: { enabled: true, asLocalhost: true } });

    return await gateway.getNetwork(CHANNEL);
};

const cleanup = async (email) => {
    if(gateway) gateway.disconnect();
    if(wallet) await wallet.remove(email);
};

export default {
    getNetworkfromAuth,
    cleanup
}