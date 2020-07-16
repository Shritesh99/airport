import { AuthenticationError, ForbiddenError } from 'apollo-server';
import { 
    Constants,
    FabricUtils
} from '../utils';

const {
    CHAINCODE,
} = process.env;

const getContract = async (auth) => {
    const network = await FabricUtils.getNetwork(auth.signCert, auth.privateKey, auth.mspId,  auth.email);
    return network.getContract(CHAINCODE, Constants.StateContract);
};

const StateResolver = {
    Query: {
        state: async (parent, args, context) => {
            const auth = context.auth;
            if(auth){
                const contract = await getContract(auth);
                if(args.input.id) {
                    const res = await contract.evaluateTransaction('getStateByID', args.input.id);
                    await FabricUtils.cleanup(auth.email);
                    return JSON.parse(res);
                }
                else if (args.input.state) {
                    const res = await contract.evaluateTransaction('getStateByName', args.input.state);
                    await FabricUtils.cleanup(auth.email);
                    return JSON.parse(res);
                }else{
                    return new ForbiddenError('No filter provided');
                }                    
            }else {
                return new AuthenticationError('User not authenticated');
            }
        },
        states: async (parent, args, context) => {
            const auth = context.auth;
            if(auth){
                const contract = await getContract(auth);
                const res = await contract.evaluateTransaction('getAllStates');
                await FabricUtils.cleanup(auth.email);
                return JSON.parse(res);
            }else {
                return new AuthenticationError('User not authenticated');
            }
        }
    },
    Mutation: {
        createState: async (parent, args, context) => {
            const auth = context.auth;
            if(auth){
                const contract = await getContract(auth);
                const res = await contract.submitTransaction('createState', args.input.state, args.input.country);
                await FabricUtils.cleanup(auth.email);
                return JSON.parse(res);
            }else {
                return new AuthenticationError('User not authenticated');
            }
        }
    }
};

export default StateResolver;