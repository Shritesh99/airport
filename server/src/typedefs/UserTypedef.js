import { gql } from 'apollo-server';

const UserTypedef = gql`
type State {
  state: String!
  country: String!
}

extend type Query {
  states: [State]
  createState(state: String!, country: String!): State
}

type Address {
  line1: String!
  line2: String
  pinCode: Int!
  city: String!
  state: State!
}

enum Roles {
  DGCA,
  Operator,
  Owner,
  AerodromeInspector,
  RegionalOfficeHead
}

type User {
  id: ID!
  email: EmailAddress!
  firstName: String!
  phone: PhoneNumber!
  address: [Address!]
  role: Roles
  signImage: String
}

type AuthResponse {
  token: String!
  user: User
}

input UserFilter{
  _id: ID
  email: String
}

input UserFields {
  name: String
  email: EmailAddress,
  phone: PhoneNumber,
  password: String,
  signImage: String
}

extend type Query {
  me: User!
  signIn(email: String!, password: String!, privatekeyFile: Upload!, signCertFile: Upload!): AuthResponse
  logout: Boolean!
  deleteAccount(filter: UserFilter): Boolean!
}

extend type Mutation {
  createUser(input: UserFields!, privatekeyFile: Upload!, signCertFile: Upload!): AuthResponse
  updateUser(filter: UserFilter, input: UserFields): Boolean!
}
`;

export default UserTypedef;
