import { AuthenticationError } from "apollo-server";
import { Constants, FabricUtils, Utils } from "../utils";
import { v4 } from "uuid";
const { CHAINCODE } = process.env;

const getContract = async (auth) => {
  const network = await FabricUtils.getNetwork(
    auth.signCert,
    auth.privateKey,
    auth.mspId,
    auth.email
  );
  return network.getContract(CHAINCODE, Constants.Contracts.LicenseContract);
};
const enterForm = async (context, id, data, form) => {
  const auth = context.auth;
  if (auth) {
    const contract = await getContract(auth);
    await contract.submitTransaction(
      "saveForm",
      id,
      form,
      JSON.stringify(data)
    );
    //await FabricUtils.cleanup(auth.email);
    return true;
  } else {
    return new AuthenticationError("User not authenticated");
  }
};
const updateForm = async (context, id, data, form, status = null) => {
  const auth = context.auth;
  if (auth) {
    if (auth.role === Constants.Roles.Operator) {
      const contract = await getContract(auth);
      await contract.submitTransaction(
        "updateForm",
        id,
        form,
        JSON.stringify(data)
      );
      return true;
    } else {
      const contract = await getContract(auth);
      await contract.submitTransaction(
        "updateFormByReviewer",
        id,
        form,
        JSON.stringify(data),
        status ? status : Constants.FormStatus.NotAproved
      );
      return true;
    }
  } else {
    return new AuthenticationError("User not authenticated");
  }
};
const LicenseResolver = {
  Usage: Constants.Usage,
  LicenseStatus: Constants.LicenseStatus,
  FormStatus: Constants.FormStatus,
  Query: {
    license: async (parent, args, context) => {
      const auth = context.auth;
      if (auth) {
        const contract = await getContract(auth);
        const res = await contract.evaluateTransaction(
          "getLicenseByID",
          args.id
        );
        //await FabricUtils.cleanup(auth.email);
        return JSON.parse(res.toString());
      } else {
        return new AuthenticationError("User not authenticated");
      }
    },
    licenses: async (parent, args, context) => {
      const auth = context.auth;
      if (auth) {
        if (args.filter.status) {
          const contract = await getContract(auth);
          const res = await contract.evaluateTransaction(
            "getAllLicensesForStatus",
            args.status
          );
          //await FabricUtils.cleanup(auth.email);
          return JSON.parse(res.toString());
        } else if (args.filter.operator) {
          const contract = await getContract(auth);
          const res = await contract.evaluateTransaction(
            "getAllLicensesForOperator",
            args.operator
          );
          //await FabricUtils.cleanup(auth.email);
          return JSON.parse(res.toString());
        } else if (args.filter.inspector) {
          const contract = await getContract(auth);
          const res = await contract.evaluateTransaction(
            "getAllLicensesForInpector",
            args.inspector
          );
          //await FabricUtils.cleanup(auth.email);
          return JSON.parse(res.toString());
        } else {
          const contract = await getContract(auth);
          const res = await contract.evaluateTransaction("getAllLicenses");
          //await FabricUtils.cleanup(auth.email);
          return JSON.parse(res.toString());
        }
      } else {
        return new AuthenticationError("User not authenticated");
      }
    },
    licenseHistory: async (parent, args, context) => {
      const auth = context.auth;
      if (auth) {
        const contract = await getContract(auth);
        const res = await contract.evaluateTransaction("getHistory", args.id);
        //await FabricUtils.cleanup(auth.email);
        return JSON.parse(res.toString());
      } else {
        return new AuthenticationError("User not authenticated");
      }
    },
    generateLicense: async (parent, args, context) => {
      const auth = context.auth;
      if (auth) {
        const contract = await getContract(auth);
        const res = await contract.evaluateTransaction(
          "getLicenseByID",
          args.id
        );
        //await FabricUtils.cleanup(auth.email);
        const license = JSON.parse(res.toString());
        const data = {
          holder: license.operator.name,
          aerodrome: license.aerodrome.placeName,
          date: new Date(Date.now()).toLocaleString().split(",")[0],
          id: license.id,
          usage: license.form2.usage,
          lat: license.aerodrome.lat,
          long: license.aerodrome.long,
        };
        // Generate pdf
        const url = await Utils.generatePdf(data);
        //await FabricUtils.cleanup(auth.email);
        const licenseR = await contract.submitTransaction(
          "generateLicense",
          args.id,
          url,
          Utils.getDate(),
          Utils.getDate(args.expiryYears)
        );
        //await FabricUtils.cleanup(auth.email);
        return JSON.parse(licenseR.toString());
      } else {
        return new AuthenticationError("User not authenticated");
      }
    },
  },
  Mutation: {
    enterAerodrome: async (parent, args, context) => {
      const auth = context.auth;
      if (auth) {
        const data = args.input;
        const gridFile = await args.input.grid;
        const grid = await Utils.putFileOnIpFs(gridFile);
        data.grid = grid;
        const contract = await getContract(auth);
        await contract.submitTransaction(
          "createLicense",
          v4(),
          auth.id,
          JSON.stringify(data)
        );
        //await FabricUtils.cleanup(auth.email);
        return true;
      } else {
        return new AuthenticationError("User not authenticated");
      }
    },
    updateAerodromeWithoutUpload: async (parent, args, context) =>
      await updateForm(
        context,
        args.id,
        args.input,
        "aerodrome",
        args.input.status ? args.input.status : null
      ),
    updateAerodromeUpload: async (parent, args, context) => {
      const data = args.input;
      const gridFile = await args.input.grid;
      const grid = await Utils.putFileOnIpFs(gridFile);
      data.grid = grid;
      return await updateForm(
        context,
        args.id,
        data,
        "aerodrome",
        args.input.status ? args.input.status : null
      );
    },
    enterForm2: async (parent, args, context) =>
      await enterForm(context, args.id, args.input, "form2"),
    updateForm2: async (parent, args, context) =>
      await updateForm(
        context,
        args.id,
        args.input,
        "form2",
        args.input.status ? args.input.status : null
      ),
    enterForm3: async (parent, args, context) =>
      await enterForm(context, args.id, args.input, "form3"),
    updateForm3: async (parent, args, context) =>
      await updateForm(
        context,
        args.id,
        args.input,
        "form3",
        args.input.status ? args.input.status : null
      ),
    enterForm4: async (parent, args, context) =>
      await enterForm(context, args.id, args.input, "form4"),
    updateForm4: async (parent, args, context) =>
      await updateForm(
        context,
        args.id,
        args.input,
        "form4",
        args.input.status ? args.input.status : null
      ),
    enterForm5: async (parent, args, context) => {
      const data = args.input;
      data.personInchargeResume.data = await Utils.putFileOnIpFs(
        await args.input.personInchargeResume.data
      );
      data.aerodromeSafetyResume.data = await Utils.putFileOnIpFs(
        await args.input.aerodromeSafetyResume.data
      );
      data.day_to_day_operation_of_aerodrome.data = await Utils.putFileOnIpFs(
        await args.input.day_to_day_operation_of_aerodrome.data
      );
      data.person_responsible_for_Aerodrome_Safety.data = await Utils.putFileOnIpFs(
        await args.input.person_responsible_for_Aerodrome_Safety.data
      );
      return await enterForm(context, args.id, args.input, "form5");
    },
    updateForm5: async (parent, args, context) =>
      await updateForm(
        context,
        args.id,
        args.input,
        "form5",
        args.input.status ? args.input.status : null
      ),
    enterForm6: async (parent, args, context) => {
      const data = args.input;
      data.manual.data = await Utils.putFileOnIpFs(
        await args.input.manual.data
      );
      return await enterForm(context, args.id, args.input, "form6");
    },
    updateForm6: async (parent, args, context) =>
      await updateForm(
        context,
        args.id,
        args.input,
        "form6",
        args.input.status ? args.input.status : null
      ),
    enterForm7: async (parent, args, context) => {
      const data = args.input;
      data.calculationSheet.data = await Utils.putFileOnIpFs(
        await args.input.calculationSheet.data
      );
      return await enterForm(context, args.id, args.input, "form7");
    },
    updateForm7: async (parent, args, context) =>
      await updateForm(
        context,
        args.id,
        args.input,
        "form7",
        args.input.status ? args.input.status : null
      ),
    enterForm8: async (parent, args, context) =>
      await enterForm(context, args.id, args.input, "form8"),
    updateForm8: async (parent, args, context) =>
      await updateForm(
        context,
        args.id,
        args.input,
        "form8",
        args.input.status ? args.input.status : null
      ),
    updateStatus: async (parent, args, context) => {
      const auth = context.auth;
      if (auth) {
        const contract = await getContract(auth);
        await contract.submitTransaction(
          "updateLicenseStatus",
          args.id,
          args.status
        );
        //await FabricUtils.cleanup(auth.email);
        return true;
      } else {
        return new AuthenticationError("User not authenticated");
      }
    },
    assignInspector: async (parent, args, context) => {
      const auth = context.auth;
      if (auth) {
        const contract = await getContract(auth);
        await contract.submitTransaction(
          "assignInspector",
          args.id,
          args.inspectorId
        );
        //await FabricUtils.cleanup(auth.email);
        return true;
      } else {
        return new AuthenticationError("User not authenticated");
      }
    },
  },
};

export default LicenseResolver;
