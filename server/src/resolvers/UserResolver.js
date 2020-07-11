import { AuthenticationError, ForbiddenError } from 'apollo-server';
import { Gateway, Wallets } from 'fabric-network';

const profile = require('../../network-profile.json');
import bcrypt from 'bcrypt';

import { createJwt } from '../utils/passport';
import { redis } from '../utils/db';

const {
  CHAINCODE,
  CHANNEL,
} = process.env;

const saveToRedis = async (id, token) => {
  const redisData = await redis.get(id);
  if(redisData !== undefined){
      const arr = redisData['access_tokens'];
      arr.push(token);
      await redis.set(id, { "access_tokens": arr });
  }
  else{
      await redis.set(id, {
          "access_tokens": [token]
      });
  }
};

const getContract = async (args) => {
  
};

const GETALLSTATES = 'getAllStates';
const UserResolver = {
  Query: {
    me: async (parent, args, context) => {
      
    },
    signIn: async (parent, args, context) => {
      
    },
  },

  Mutation: {
    createUser: async (parent, args, context) => {
      
    }
  }
};

export default UserResolver;
