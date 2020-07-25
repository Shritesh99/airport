import { gql } from "apollo-server";

const LicenseTypedef = gql`
  type Field {
    data: String
    suggestion: String
    checked: Boolean
  }
  enum FormStatus {
    Submitted
    Edited
    NotAproved
    Approved
  }
  type Runway {
    orentatation: String
    length: String
  }
  type Form1 {
    placeName: String
    state: State
    city: String
    situation: String
    grid: String
    elevationMeter: Field
    runways: [Runway]
    owner: User
    status: FormStatus
  }
  enum Usage {
    Public
    Private
  }
  type Form2 {
    usage: Usage
    purpose: Field
    ownAircraft: Boolean
    priorPermission: Boolean
    allWeatherRequired: Boolean
    lightningPlan: Field
    cnsAtm: Field
    metFacilities: Field
    aviationActivities: Field
    heaviestType: Field
    heaviestWeight: Field
    heaviestLength: Field
    heaviestWidth: Field
    status: FormStatus
  }

  type Form3 {
    owner: Boolean
    rightsIfNotOver: Field
    startPeriod: String
    terminationPeriod: String
    endPeriod: String
    status: FormStatus
  }

  type Form4 {
    homeBool: Boolean
    defenceBool: Boolean
    homeTime: String
    defenceTime: String
    status: FormStatus
  }
  type AddressPerson {
    line1: String
    line2: String
    pinCode: Int
    city: String
    state: String
    country: String
  }

  type Person {
    name: String
    designation: String
    phone: String
    address: AddressPerson
    signImage: String
  }
  type Form5 {
    safetyPerson: Person
    personIncharge: Person
    aerodromeSafety: Person
    cnsAtm: Person
    metServices: Person
    metServicesProvider: Person
    airTrafficMgmt: Person
    provisionCNS: Person
    provisionRFF: Person
    status: FormStatus
  }
  type Form6 {
    manual: Field
    elclosed: Boolean
    indicateDGCA: String
    status: FormStatus
  }
  type Form7 {
    challanNo: String
    amount: String
    claculationSheet: Field
    nameofDraweeBank: String
    dateOfChallan: String
    localAuthority: Field
    status: FormStatus
  }
  type Form8 {
    otherInfo: Field
    status: FormStatus
  }
  enum LicenseStatus {
    Approved
    Rejected
    UnderEvaluation
    Approved_for_onsite_inspection
    Not_Approved_for_onsite_inspection
    DOAS_has_recommended_DG_for_grant_of_a_license
    DOAS_has_generated_and_updated_license_number
    DOAS_issued_aerodrome_license_and_notifies_AAI
  }
  type License {
    id: ID!
    operator: User
    form1: Form1
    form2: Form2
    form3: Form3
    form4: Form4
    form5: Form5
    form6: Form6
    form7: Form7
    form8: Form8
    status: LicenseStatus
  }

  extend type Query {
    license(id: String): License
  }
`;

export default LicenseTypedef;
