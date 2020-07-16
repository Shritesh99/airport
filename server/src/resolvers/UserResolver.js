import { AuthenticationError, ForbiddenError } from 'apollo-server';
import FabricCAServices from 'fabric-ca-client';
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';

import { 
  Constants,
  FabricUtils,
  Utils,
  DB,
  Auth
} from '../utils';

const {
  CHAINCODE,
  DGCAOFFICEMSPID,
  REGIONSLOFFICEMSPID,
  REGIONSLOFFICECA,
} = process.env;

const getContract = async (certi, key, mspId, email) => {
  const network = await FabricUtils.getNetwork(certi, key, mspId,  email);
  return network.getContract(CHAINCODE, Constants.PersonContract);
};
const getContractFromAuth = async (auth) => {
  const network = await FabricUtils.getNetwork(auth.certi, auth.key, auth.mspId, auth.email);
  return network.getContract(CHAINCODE, Constants.PersonContract);
};

const saveToRedis = async (id, token) => {
  const redisData = await DB.redis.get(id);
  if(redisData !== undefined){
      const arr = redisData['access_tokens'];
      arr.push(token);
      await DB.redis.set(id, { "access_tokens": arr });
  }
  else{
      await DB.redis.set(id, {
          "access_tokens": [token]
      });
  }
};

const UserResolver = {
  Roles: {
    DGCA: 'DGCA',
    Admin: 'Admin',
    Operator: 'Operator',
    Owner: 'Owner',
    AerodromeInspector: 'AerodromeInspector',
    RegionalOfficeHead: 'RegionalOfficeHead'
  },
  Query: {
    me: async (parent, args, context) => {
      const auth = context.auth;
      if(auth){
        const contract = await getContractFromAuth(auth);
        const userR = await contract.evaluateTransaction('getUserByEmail', args.email);
        return JSON.parse(userR.toString());
      }
      else {
        return new AuthenticationError('User not authenticated');
      }
    },
    signIn: async (parent, args) => {
      const keyFile = await args.privatekeyFile;
      const certiFile = await args.signCertFile;
      const key = await Utils.fileToString(keyFile);
      const certi = await Utils.fileToString(certiFile);
      const contract = await getContract(certi, key, REGIONSLOFFICEMSPID, args.email);
      const userR = await contract.evaluateTransaction('getUserByEmail', args.email);
      const user = JSON.parse(userR.toString());
      await FabricUtils.cleanup(args.email);
      const passwordMatch = await bcrypt.compare(args.password, user.password);
      if (!passwordMatch)
          return new AuthenticationError('Invalid password');
      const token = Auth.createJwt(user.id, user.email, key, certi, REGIONSLOFFICEMSPID);
      await saveToRedis(user.id, token);
      return { token, user };
    },
  },

  Mutation: {
    createUser: async (parent, args, context) => {
      const auth = context.auth;
      if(auth){
          const signImageFile = await args.input.signImage;
          const govtIdFile = await args.input.govtId;
          const govtId = Utils.putFileOnIpFs(govtIdFile);
          const signFile = Utils.putFileOnIpFs(signImageFile);
          const password = await bcrypt.hashSync(args.input.password, 12);
          const contract = await getContractFromAuth(auth);

          const userR = await contract.submitTransaction(
            'createUser',
            v4(),
            args.input.name,
            args.input.email,
            password, args.input.phone,
            args.input.role, 
            signFile, 
            govtId,
            v4(),
            args.input.address.line1,
            args.input.address.line2,
            args.input.address.city, 
            args.input.address.state, 
            args.input.address.pinCode
          );

          const ca = new FabricCAServices(REGIONSLOFFICECA);
          const adminIdentity = await FabricUtils.wallet.get(auth.email);
          const provider = FabricUtils.wallet.getProviderRegistry().getProvider(adminIdentity.type);
          const adminUser = await provider.getUserContext(adminIdentity, auth.email);
          const secret = await ca.register({
            enrollmentID: args.input.email,
            role: args.input.role
          }, adminUser);
          const enrollment = await ca.enroll({
            enrollmentID: args.input.email,
            enrollmentSecret: secret
          });
          await Utils.sendMailfromEnrolment(enrollment, args.input.email);
          await FabricUtils.cleanup(args.input.email);
          const user = JSON.parse(userR.toString());
          return user;
      }
      else {
        return new AuthenticationError('User not authenticated');
      }
    }
  }
};

export default UserResolver;
