import { gql } from 'apollo-server';
import { typeDefs } from 'graphql-scalars';
// Models
import UserTypedef from './UserTypedef';

const root = gql`
type Query {
    _empty: String
}

type Mutation {
    _empty: String
}
`;

export default [
    root,
    ...typeDefs,
    UserTypedef
];
