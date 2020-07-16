import { gql } from 'apollo-server';

const StateTypedef = gql`
type State {
    id: ID!
    state: String!
    country: String!
}

input StateFilter{
    id: ID
    state: String
}
input StateFields {
    state: String
    country: String
}
extend type Query {
    state(filter: StateFilter): State
    states: [State]
}
extend type Mutation {
    createState(input: StateFields!): State
}
`;

export default StateTypedef;
