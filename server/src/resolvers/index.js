import { resolvers } from "graphql-scalars";
import StateResolver from "./StateResolver";
import UserResolver from "./UserResolver";
import LicenseResolver from "./LicenseResolver";

export default [resolvers, StateResolver, UserResolver, LicenseResolver];
