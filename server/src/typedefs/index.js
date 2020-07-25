import { gql } from "apollo-server";
import { typeDefs } from "graphql-scalars";
// Models
import StateTypedef from "./StateTypedef";
import UserTypedef from "./UserTypedef";
import LicenseTypedef from "./LicenseTypedef";

const root = gql`
  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

export default [root, ...typeDefs, StateTypedef, UserTypedef, LicenseTypedef];
