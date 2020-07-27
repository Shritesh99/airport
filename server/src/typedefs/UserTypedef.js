import { gql } from "apollo-server";

const UserTypedef = gql`
  type Address {
    id: ID
    line1: String
    line2: String
    pinCode: Int
    city: String
    state: State
  }

  input AddressFields {
    line1: String
    line2: String
    pinCode: Int
    city: String
    state: StateFields
  }

  enum Roles {
    DGCA
    Admin
    Operator
    Owner
    AerodromeInspector
    RegionalOfficeHead
  }

  type User {
    id: ID!
    name: String!
    email: String!
    phone: PhoneNumber
    role: Roles
    signImage: String
    govtId: String
    address: Address
  }

  type AuthResponse {
    token: String!
    user: User
  }

  input UserFilter {
    id: ID
    email: String
  }

  input UserFields {
    name: String
    email: EmailAddress
    phone: PhoneNumber
    role: Roles
    signImage: Upload
    govtId: Upload
    address: AddressFields
  }

  extend type Query {
    me: User!
    user(filter: UserFilter!): User
    users(role: String): [User]
    signIn(
      email: String!
      password: String!
      privatekeyFile: Upload!
      signCertFile: Upload!
    ): AuthResponse
    logout: Boolean!
  }

  extend type Mutation {
    createUser(input: UserFields!): User
  }
`;

export default UserTypedef;
