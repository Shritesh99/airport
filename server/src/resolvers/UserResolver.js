import { AuthenticationError, ForbiddenError } from 'apollo-server';
const os = require('os');
const path = require('path');
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';

import { createJwt } from '../utils/passport';
import { redis } from '../utils/db';

const {
  CHAINCODE,
  CHANNEL,
  MSPID,
  NETWORK_PROFILE_PATH,
  NETWORK_PROFILE,
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

const getController = async (args) => {
  
};


const UserResolver = {
  Query: {
    signIn: async (parent, args, context) => {
      
    },

    createState: async (parent, args, context) => {

    }
  },

  Mutation: {
    createUser: async (parent, args, context) => {
      
    }
  }
};

export default UserResolver;
