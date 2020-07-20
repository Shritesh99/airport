import { Gateway, Wallets } from "fabric-network";
import dotenv from "dotenv";
import { X509 } from "./constants";
const profile = require("../../network-profile.json");

// Dotenv config
dotenv.config();
const { CHANNEL } = process.env;

let wallet = null;
let gateway = null;

const getNetwork = async (certi, key, mspId, email) => {
  if (!wallet) await setWallet(certi, key, mspId, email);
  if (!gateway) {
    gateway = new Gateway();
    await gateway.connect(profile, {
      wallet,
      identity: email,
      discovery: { enabled: true, asLocalhost: true },
    });
  }
  return await gateway.getNetwork(CHANNEL);
};
const setWallet = async (certi, key, mspId, email) => {
  if (!wallet) wallet = await Wallets.newInMemoryWallet();
  const x509Identity = {
    credentials: {
      certificate: certi,
      privateKey: key,
    },
    mspId,
    type: X509,
  };
  await wallet.put(email, x509Identity);
  return wallet;
};

const cleanup = async (email) => {
  if (gateway) {
    gateway.disconnect();
    gateway = null;
  }
  if (wallet) {
    await wallet.remove(email);
    wallet = null;
  }
};

export { getNetwork, setWallet, wallet, cleanup };
