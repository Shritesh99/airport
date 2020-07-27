import { AuthenticationError, ForbiddenError } from "apollo-server";
import { Constants, FabricUtils } from "../utils";
import { v4 } from "uuid";
const { CHAINCODE } = process.env;

const getContract = async (auth) => {
  const network = await FabricUtils.getNetwork(
    auth.signCert,
    auth.privateKey,
    auth.mspId,
    auth.email
  );
  return network.getContract(CHAINCODE, Constants.StateContract);
};

const StateResolver = {
  Query: {
    state: async (parent, args, context) => {
      const auth = context.auth;
      if (auth) {
        const contract = await getContract(auth);
        if (args.filter.id) {
          const res = await contract.evaluateTransaction(
            "getStateByID",
            args.filter.id
          );
          //await FabricUtils.cleanup(auth.email);
          return JSON.parse(res);
        } else if (args.filter.state) {
          const res = await contract.evaluateTransaction(
            "getStatebyName",
            args.filter.state
          );
          //await FabricUtils.cleanup(auth.email);
          return JSON.parse(res);
        } else {
          return new ForbiddenError("No filter provided");
        }
      } else {
        return new AuthenticationError("User not authenticated");
      }
    },
    states: async (parent, args, context) => {
      const auth = context.auth;
      if (auth) {
        const contract = await getContract(auth);
        const res = await contract.evaluateTransaction("getAllStates");
        //await FabricUtils.cleanup(auth.email);
        return JSON.parse(res);
      } else {
        return new AuthenticationError("User not authenticated");
      }
    },
    stateHistory: async (parent, args, context) => {
      const auth = context.auth;
      if (auth) {
        const contract = await getContract(auth);
        const res = await contract.evaluateTransaction("getHistory", args.id);
        //await FabricUtils.cleanup(auth.email);
        const l = JSON.parse(res);
        console.log(l);
      } else {
        return new AuthenticationError("User not authenticated");
      }
    },
  },
  Mutation: {
    createState: async (parent, args, context) => {
      const auth = context.auth;
      if (auth) {
        const contract = await getContract(auth);
        const data = {
          id: v4(),
          state: args.input.state,
          country: args.input.country,
        };
        const res = await contract.submitTransaction(
          "createState",
          JSON.stringify(data)
        );
        //await FabricUtils.cleanup(auth.email);
        return JSON.parse(res);
      } else {
        return new AuthenticationError("User not authenticated");
      }
    },
  },
};

export default StateResolver;
