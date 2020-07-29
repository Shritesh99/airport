// Utils
const ONE_DAY = 1;
const THIRTY_DAYS = 30;
const X509 = "X.509";

// Contracts
const Contracts = {
  StateContract: "StateContract",
  PersonContract: "PersonContract",
  LicenseContract: "LicenseContract",
};

// Mail Message
const Mail = {
  MailMessage: `\nCheck your Private key file and Signed certificate.`,
  MailSubject: "Airport Network Files",
};
// IPFS Url
const IpfsUrl = "https://ipfs.infura.io:5001/api/v0/cat?arg=";
// Roles
const Roles = {
  DGCA: "DGCA",
  Admin: "Admin",
  Operator: "Operator",
  Owner: "Owner",
  DefenceMinistry: "DefenceMinistry",
  HomeMinistry: "HomeMinistry",
  AerodromeInspector: "AerodromeInspector",
  RegionalOfficeHead: "RegionalOfficeHead",
};

// Form Status
const FormStatus = {
  Submitted: "Submmited",
  Edited: "Edited",
  NotAproved: "NotAproved",
  Approved: "Approved",
};
// License Status
const LicenseStatus = {
  Approved: "Approved",
  Rejected: "Rejected",
  UnderInspection: "UnderInspection",
  Correct_Data: "Correct_Data",
  Waiting_for_misitries_approval: "Waiting_for_misitries_approval",
  Waiting_For_Data: "Waiting_For_Data",
};
// Usage
const Usage = {
  Public: "Public",
  Private: "Private",
};
export {
  ONE_DAY,
  THIRTY_DAYS,
  X509,
  Contracts,
  Mail,
  IpfsUrl,
  Roles,
  LicenseStatus,
  FormStatus,
  Usage,
};
