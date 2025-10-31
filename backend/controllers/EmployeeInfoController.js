const EmployeeInfo = require("../models/EmployeeInfo.js");
const Employee = require("../models/Employee.js");
const Opt = require("../models/Opt.js");

const getEmployeeInfo = async (req, res, next) => {
  try {
    const employeeInfo = await EmployeeInfo.findOne({
      employeeId: req.params?.employeeId,
    });
    if (!employeeInfo) {
      const err = new Error("EmployeeInfo not found");
      err.statusCode = 404;
      next(err);
      return;
    }
    res.status(200).json(employeeInfo);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const updateEmployeeInfo = async (req, res, next) => {
  try {
    // only the authenticated employee can update their own info
    if (req.user?.id !== req.params?.employeeId) {
      const err = new Error("Forbidden: cannot modify other user's info");
      err.statusCode = 403;
      next(err);
      return;
    }

    let employeeInfo = await EmployeeInfo.findOne({
      employeeId: req.params?.employeeId,
    });
    if (!employeeInfo) {
      employeeInfo = new EmployeeInfo({});
      await Employee.updateOne(
        { _id: req.params?.employeeId },
        { personInfo: employeeInfo._id }
      );
      employeeInfo.employeeId = req.params?.employeeId;
    }
    employeeInfo.firstName = req.body.firstName || employeeInfo.firstName;
    employeeInfo.lastName = req.body.lastName || employeeInfo.lastName;
    employeeInfo.middleName = req.body.middleName || employeeInfo.middleName;
    employeeInfo.preferredName =
      req.body.preferredName || employeeInfo.preferredName;
    if (req.file) {
      employeeInfo.profilePicture = `http://localhost:3000/fileStorage/${req.file.filename}`;
    }
    employeeInfo.addressBuilding =
      req.body.addressBuilding || employeeInfo.addressBuilding;
    employeeInfo.addressStreet =
      req.body.addressStreet || employeeInfo.addressStreet;
    employeeInfo.addressCity = req.body.addressCity || employeeInfo.addressCity;
    employeeInfo.addressState =
      req.body.addressState || employeeInfo.addressState;
    employeeInfo.addressZip = req.body.addressZip || employeeInfo.addressZip;
    employeeInfo.cellPhone = req.body.cellPhone || employeeInfo.cellPhone;
    employeeInfo.workPhone = req.body.workPhone || employeeInfo.workPhone;
    employeeInfo.email = req.body.email || employeeInfo.email;
    employeeInfo.ssn = req.body.ssn || employeeInfo.ssn;
    employeeInfo.dateOfBirth = req.body.dateOfBirth || employeeInfo.dateOfBirth;
    employeeInfo.gender = req.body.gender || employeeInfo.gender;
    // visa is derived from isPrOrCitizen/prOrCitizenType/workAuthType in this app
    employeeInfo.addressBuilding =
      req.body.addressBuilding || employeeInfo.addressBuilding;
    employeeInfo.referenceFirstName =
      req.body.referenceFirstName || employeeInfo.referenceFirstName;
    employeeInfo.referenceLastName =
      req.body.referenceLastName || employeeInfo.referenceLastName;
    employeeInfo.referenceMiddleName =
      req.body.referenceMiddleName || employeeInfo.referenceMiddleName;
    employeeInfo.referencePhone =
      req.body.referencePhone || employeeInfo.referencePhone;
    employeeInfo.referenceEmail =
      req.body.referenceEmail || employeeInfo.referenceEmail;
    employeeInfo.referenceRelationship =
      req.body.referenceRelationship || employeeInfo.referenceRelationship;
    employeeInfo.emergencyContact =
      req.body.emergencyContact || employeeInfo.emergencyContact;
    employeeInfo.isPrOrCitizen =
      req.body.isPrOrCitizen || employeeInfo.isPrOrCitizen;
    employeeInfo.prOrCitizenType =
      req.body.prOrCitizenType || employeeInfo.prOrCitizenType;
    employeeInfo.workAuthType =
      req.body.workAuthType || employeeInfo.workAuthType;
    employeeInfo.visaTitle = req.body.visaTitle || employeeInfo.visaTitle;
    employeeInfo.visaStartDate =
      req.body.visaStartDate || employeeInfo.visaStartDate;
    employeeInfo.visaEndDate = req.body.visaEndDate || employeeInfo.visaEndDate;
    employeeInfo.driverLicense =
      req.body.driverLicense || employeeInfo.driverLicense;
    employeeInfo.workAuthDoc =
      req.body.workAuthDoc || employeeInfo.workAuthDoc;
    employeeInfo.optReceipt = req.body.optReceipt || employeeInfo.optReceipt;
    await employeeInfo.save();

    if (req.body.optReceipt) {
      const optReceipt = new Opt({
        type: "OPT Receipt",
        doc: req.body.optReceipt, // Doc id here
        employeeId: employeeInfo.employeeId,
      });
      await optReceipt.save();
      await Employee.updateOne(
        { _id: req.params?.employeeId },
        { $push: { optList: optReceipt._id } }
      );
    }

    res.status(200).json(employeeInfo);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const submitForm = async (req, res, next) => {
  try {
    // only the authenticated employee can submit their own form
    if (req.user?.id !== req.params?.employeeId) {
      const err = new Error("Forbidden: cannot submit for other user");
      err.statusCode = 403;
      next(err);
      return;
    }

    const employee = await Employee.findById(req.params?.employeeId);
    if (employee.stage === "onboarding") {
      if (
        employee.status === "never_submit" ||
        employee.status === "rejected"
      ) {
        employee.status = "pending";
        // Record submission date as ISO YYYY-MM-DD to avoid TZ drift
        const today = new Date();
        const isoDate = today.toISOString().slice(0, 10); // YYYY-MM-DD
        employee.submissionDate = isoDate;
      } else {
        const err = new Error("Status wrong");
        err.statusCode = 404;
        next(err);
        return;
      }
    } else {
      const err = new Error("Stage wrong");
      err.statusCode = 404;
      next(err);
      return;
    }
    await employee.save();
    res.status(200).json({ stage: employee.stage, status: employee.status });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

module.exports = {
  getEmployeeInfo,
  updateEmployeeInfo,
  submitForm,
};
