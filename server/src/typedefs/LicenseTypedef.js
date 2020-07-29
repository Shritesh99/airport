import { gql } from "apollo-server";

const LicenseTypedef = gql`
  type Field {
    data: String
    suggestion: String
    checked: Boolean
  }
  input FieldField {
    data: String
    suggestion: String
    checked: Boolean
  }
  input FileField {
    data: Upload
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
  input RunwayFields {
    orentatation: String
    length: String
  }
  type Aerodrome {
    placeName: String
    state: State
    city: String
    situation: String
    grid: String
    elevationMeter: Field
    runways: [Runway]
    owner: User
    lat: String
    long: String
    status: FormStatus
  }
  input AerodromeFields {
    placeName: String
    state: String
    city: String
    situation: String
    grid: Upload
    runways: [RunwayFields]
    owner: String
    lat: String
    long: String
    status: FormStatus
  }
  input AerodromeFieldsWithoutUpload {
    placeName: String
    state: String
    city: String
    situation: String
    grid: String
    runways: [RunwayFields]
    owner: String
    lat: String
    long: String
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
  input Form2Fields {
    usage: Usage
    purpose: FieldField
    ownAircraft: Boolean
    priorPermission: Boolean
    allWeatherRequired: Boolean
    lightningPlan: FieldField
    cnsAtm: FieldField
    metFacilities: FieldField
    aviationActivities: FieldField
    heaviestType: FieldField
    heaviestWeight: FieldField
    heaviestLength: FieldField
    heaviestWidth: FieldField
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
  input Form3Fields {
    owner: Boolean
    rightsIfNotOver: FieldField
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
  input Form4Fields {
    homeBool: Boolean
    defenceBool: Boolean
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
  input AddressPersonFields {
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
  input PersonFields {
    name: String
    designation: String
    phone: String
    address: AddressPersonFields
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
    personInchargeResume: Field
    aerodromeSafetyResume: Field
    day_to_day_operation_of_aerodrome: Field
    person_responsible_for_Aerodrome_Safety: Field
    status: FormStatus
  }
  input Form5Fields {
    safetyPerson: PersonFields
    personIncharge: PersonFields
    aerodromeSafety: PersonFields
    cnsAtm: PersonFields
    metServices: PersonFields
    metServicesProvider: PersonFields
    airTrafficMgmt: PersonFields
    provisionCNS: PersonFields
    provisionRFF: PersonFields
    personInchargeResume: FileField
    aerodromeSafetyResume: FileField
    day_to_day_operation_of_aerodrome: FileField
    person_responsible_for_Aerodrome_Safety: FileField
    status: FormStatus
  }
  input Form5FieldsWithoutUpload {
    safetyPerson: PersonFields
    personIncharge: PersonFields
    aerodromeSafety: PersonFields
    cnsAtm: PersonFields
    metServices: PersonFields
    metServicesProvider: PersonFields
    airTrafficMgmt: PersonFields
    provisionCNS: PersonFields
    provisionRFF: PersonFields
    personInchargeResume: FieldField
    aerodromeSafetyResume: FieldField
    day_to_day_operation_of_aerodrome: FieldField
    person_responsible_for_Aerodrome_Safety: FieldField
    status: FormStatus
  }
  type Form6 {
    manual: Field
    enclosed: Boolean
    indicateDGCA: String
    status: FormStatus
  }
  input Form6Fields {
    manual: FileField
    enclosed: Boolean
    indicateDGCA: String
    status: FormStatus
  }
  input Form6FieldsWithoutUpload {
    manual: FieldField
    enclosed: Boolean
    indicateDGCA: String
    status: FormStatus
  }
  type Form7 {
    challanNo: String
    amount: String
    calculationSheet: Field
    nameofDraweeBank: String
    dateOfChallan: String
    status: FormStatus
  }
  input Form7Fields {
    challanNo: String
    amount: String
    calculationSheet: FileField
    nameofDraweeBank: String
    dateOfChallan: String
    status: FormStatus
  }
  input Form7FieldsWithoutUpload {
    challanNo: String
    amount: String
    calculationSheet: FieldField
    nameofDraweeBank: String
    dateOfChallan: String
    status: FormStatus
  }
  type Form8 {
    otherInfo: Field
    status: FormStatus
  }
  input Form8Fields {
    otherInfo: FieldField
    status: FormStatus
  }
  enum LicenseStatus {
    Approved
    Rejected
    UnderInspection
    Correct_Data
    Waiting_for_misitries_approval
    Waiting_For_Data
  }
  type License {
    id: ID!
    operator: User
    inspector: User
    aerodrome: Aerodrome
    form2: Form2
    form3: Form3
    form4: Form4
    form5: Form5
    form6: Form6
    form7: Form7
    form8: Form8
    status: LicenseStatus
    license: String
    expiry: Int
    date: Int
  }
  input LicenseFilter {
    status: String
    inspector: String
    operator: String
  }

  extend type Query {
    license(id: String!): License
    licenses(filter: LicenseFilter): [License]
    licenseHistory(id: String!): JSON

    generateLicense(id: String!, expiryYears: Int): License
  }
  extend type Mutation {
    updateStatus(id: String!, status: String!): Boolean
    assignInspector(id: String!, inspectorId: String!): Boolean
    enterAerodrome(id: String!, input: AerodromeFields): Boolean
    updateAerodromeWithoutUpload(
      id: String!
      input: AerodromeFieldsWithoutUpload
    ): Boolean
    updateAerodromeUpload(id: String!, input: AerodromeFields): Boolean
    enterForm2(id: String!, input: Form2Fields): Boolean
    updateForm2(id: String!, input: Form2Fields): Boolean
    enterForm3(id: String!, input: Form3Fields): Boolean
    updateForm3(id: String!, input: Form3Fields): Boolean
    enterForm4(id: String!, input: Form4Fields): Boolean
    updateForm4(id: String!, input: Form4Fields): Boolean
    enterForm5(id: String!, input: Form5Fields): Boolean
    updateForm5(id: String!, input: Form5FieldsWithoutUpload): Boolean
    enterForm6(id: String!, input: Form6Fields): Boolean
    updateForm6(id: String!, input: Form6FieldsWithoutUpload): Boolean
    enterForm7(id: String!, input: Form7Fields): Boolean
    updateForm7(id: String!, input: Form7FieldsWithoutUpload): Boolean
    enterForm8(id: String!, input: Form8Fields): Boolean
    updateForm8(id: String!, input: Form8Fields): Boolean
  }
`;

export default LicenseTypedef;
