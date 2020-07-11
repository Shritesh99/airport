import { resolvers } from 'graphql-scalars';
import StateResolver from './StateResolver';
import UserResolver from './UserResolver';

export default [
    resolvers,
    StateResolver,
    UserResolver
];
