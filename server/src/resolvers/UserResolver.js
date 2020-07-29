import { AuthenticationError, ForbiddenError } from "apollo-server";
import FabricCAServices from "fabric-ca-client";
import bcrypt from "bcrypt";
import { v4 } from "uuid";
import { Constants, FabricUtils, Utils, DB, Auth } from "../utils";
import { use } from "passport";

const {
  CHAINCODE,
  DGCAOFFICEMSPID,
  DGCAOFFICECA,
  DGCAOFFICECAURL,
  DGCAOFFICECATSL,

  REGIONALOFFICEMSPID,
  REGIONALOFFICECA,
  REGIONALOFFICECAURL,
  REGIONALOFFICECATSL,
} = process.env;

const getContract = async (certi, key, mspId, email) => {
  const network = await FabricUtils.getNetwork(certi, key, mspId, email);
  return network.getContract(CHAINCODE, Constants.Contracts.PersonContract);
};
const getContractFromAuth = async (auth) => {
  const network = await FabricUtils.getNetwork(
    auth.signCert,
    auth.privateKey,
    auth.mspId,
    auth.email
  );
  return network.getContract(CHAINCODE, Constants.Contracts.PersonContract);
};

const saveToRedis = async (id, token) => {
  const redisData = await DB.redis.get(id);
  if (redisData !== undefined) {
    const arr = redisData["access_tokens"];
    arr.push(token);
    await DB.redis.set(id, { access_tokens: arr });
  } else {
    await DB.redis.set(id, {
      access_tokens: [token],
    });
  }
};

const UserResolver = {
  Roles: Constants.Roles,
  Query: {
    me: async (parent, args, context) => {
      const auth = context.auth;
      if (auth) {
        const contract = await getContractFromAuth(auth);
        const userR = await contract.evaluateTransaction(
          "getUserByEmail",
          auth.email
        );
        //await FabricUtils.cleanup(auth.email);
        return JSON.parse(userR.toString());
      } else {
        return new AuthenticationError("User not authenticated");
      }
    },
    user: async (parent, args, context) => {
      const auth = context.auth;
      if (auth) {
        const contract = await getContractFromAuth(auth);
        const userR = await contract.evaluateTransaction(
          args.filter.id ? "getUserById" : "getUserByEmail",
          args.filter.id ? args.filter.id : args.filter.email
        );
        //await FabricUtils.cleanup(auth.email);
        return JSON.parse(userR.toString());
      } else {
        return new AuthenticationError("User not authenticated");
      }
    },
    users: async (parent, args, context) => {
      const auth = context.auth;
      if (auth) {
        const contract = await getContractFromAuth(auth);
        const userR = await contract.evaluateTransaction(
          "getUsersByRoles",
          args.role
        );
        //await FabricUtils.cleanup(auth.email);
        return JSON.parse(userR.toString());
      } else {
        return new AuthenticationError("User not authenticated");
      }
    },
    logout: async (parent, args, context) => {
      const auth = context.auth;
      if (auth) {
        const redisData = await DB.redis.get(auth.id);
        const token = context.token;
        const arr = redisData["access_tokens"].filter((v) => v !== token);
        await DB.redis.rewrite(auth.id, { access_tokens: arr });
        return true;
      } else {
        return new AuthenticationError("User not authenticated");
      }
    },
    signIn: async (parent, args) => {
      const keyFile = await args.privatekeyFile;
      const certiFile = await args.signCertFile;
      const key = await Utils.fileToString(keyFile);
      const certi = await Utils.fileToString(certiFile);
      const contract = await getContract(
        certi,
        key,
        REGIONALOFFICEMSPID,
        args.email
      );
      const userR = await contract.evaluateTransaction(
        "getUserByEmail",
        args.email
      );
      const user = JSON.parse(userR.toString());
      if (Object.keys(user).length === 0)
        return new ForbiddenError("User not exist");
      //await FabricUtils.cleanup(args.email);
      const passwordMatch = await bcrypt.compare(args.password, user.password);
      if (!passwordMatch) return new AuthenticationError("Invalid password");
      if (args.email === "admin") {
        const caCerti = await Utils.pathToString(REGIONALOFFICECATSL, true);
        const ca = new FabricCAServices(
          REGIONALOFFICECAURL,
          {
            trustedRoots: caCerti,
            verify: false,
          },
          REGIONALOFFICECA
        );
        const enrollment = await ca.enroll({
          enrollmentID: args.email,
          enrollmentSecret: args.password,
        });
        const token = Auth.createJwt(
          user.id,
          user.email,
          enrollment.key.toBytes(),
          enrollment.certificate,
          REGIONALOFFICEMSPID,
          user.role
        );
        await saveToRedis(user.id, token);
        return { token, user };
      }
      const token = Auth.createJwt(
        user.id,
        user.email,
        key,
        certi,
        REGIONALOFFICEMSPID,
        user.role
      );
      await saveToRedis(user.id, token);
      return { token, user };
    },
    userHistory: async (parent, args, context) => {
      const auth = context.auth;
      if (auth) {
        const contract = await getContract(auth);
        const res = await contract.evaluateTransaction("getHistory", args.id);
        //await FabricUtils.cleanup(auth.email);
        return JSON.parse(res.toString());
      } else {
        return new AuthenticationError("User not authenticated");
      }
    },
  },

  Mutation: {
    createUser: async (parent, args, context) => {
      const auth = context.auth;
      if (auth) {
        const signImageFile = await args.input.signImage;
        const govtIdFile = await args.input.govtId;
        const govtId = await Utils.putFileOnIpFs(govtIdFile);
        const signFile = await Utils.putFileOnIpFs(signImageFile);
        const caCerti = await Utils.pathToString(
          auth.mspId === DGCAOFFICEMSPID
            ? DGCAOFFICECATSL
            : REGIONALOFFICECATSL,
          true
        );
        const ca = new FabricCAServices(
          auth.mspId === DGCAOFFICEMSPID
            ? DGCAOFFICECAURL
            : REGIONALOFFICECAURL,
          {
            trustedRoots: caCerti,
            verify: false,
          },
          auth.mspId === DGCAOFFICEMSPID ? DGCAOFFICECA : REGIONALOFFICECA
        );
        const wallet = await FabricUtils.setWallet(
          auth.signCert,
          auth.privateKey,
          auth.mspId,
          auth.email
        );
        const adminIdentity = await wallet.get(auth.email);
        const provider = wallet
          .getProviderRegistry()
          .getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(
          adminIdentity,
          auth.email
        );
        const secret = await ca.register(
          {
            enrollmentID: args.input.email,
            role: "client",
          },
          adminUser
        );
        const enrollment = await ca.enroll({
          enrollmentID: args.input.email,
          enrollmentSecret: secret,
        });
        const hashedPassword = await bcrypt.hashSync(secret, 12);
        const contract = await getContractFromAuth(auth);
        const userR = await contract.submitTransaction(
          "createUser",
          v4(),
          args.input.name,
          args.input.email,
          hashedPassword,
          args.input.phone,
          args.input.role,
          signFile,
          govtId,
          v4(),
          args.input.address.line1,
          args.input.address.line2,
          args.input.address.city,
          args.input.address.state.state,
          args.input.address.pinCode
        );
        const user = JSON.parse(userR.toString());
        await Utils.sendMailfromEnrolment(enrollment, args.input.email, secret);
        //await FabricUtils.cleanup(auth.email);
        return user;
      } else {
        return new AuthenticationError("User not authenticated");
      }
    },
    signInMutation: async (parent, args) => {
      const keyFile = await args.privatekeyFile;
      const certiFile = await args.signCertFile;
      const key = await Utils.fileToString(keyFile);
      const certi = await Utils.fileToString(certiFile);
      const contract = await getContract(
        certi,
        key,
        REGIONALOFFICEMSPID,
        args.email
      );
      const userR = await contract.evaluateTransaction(
        "getUserByEmail",
        args.email
      );
      const user = JSON.parse(userR.toString());
      if (Object.keys(user).length === 0)
        return new ForbiddenError("User not exist");
      //await FabricUtils.cleanup(args.email);
      const passwordMatch = await bcrypt.compare(args.password, user.password);
      if (!passwordMatch) return new AuthenticationError("Invalid password");
      if (args.email === "admin") {
        const caCerti = await Utils.pathToString(REGIONALOFFICECATSL, true);
        const ca = new FabricCAServices(
          REGIONALOFFICECAURL,
          {
            trustedRoots: caCerti,
            verify: false,
          },
          REGIONALOFFICECA
        );
        const enrollment = await ca.enroll({
          enrollmentID: args.email,
          enrollmentSecret: args.password,
        });
        const token = Auth.createJwt(
          user.id,
          user.email,
          enrollment.key.toBytes(),
          enrollment.certificate,
          REGIONALOFFICEMSPID,
          user.role
        );
        await saveToRedis(user.id, token);
        return { token, user };
      }
      const token = Auth.createJwt(
        user.id,
        user.email,
        key,
        certi,
        REGIONALOFFICEMSPID,
        user.role
      );
      await saveToRedis(user.id, token);
      return { token, user };
    },
  },
};

export default UserResolver;
