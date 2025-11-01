const Employee = require("../models/Employee.js");
const Opt = require("../models/Opt.js");

const createEmployee = async (req, res, next) => {
  try {
    const employeeByUsername = await Employee.findOne({
      username: req.body.username,
    });
    const employeeByEmail = await Employee.findOne({
      email: req.body.email,
    });
    if (employeeByUsername) {
      const err = new Error("Username already used");
      err.statusCode = 409;
      next(err);
      return;
    }
    if (employeeByEmail) {
      const err = new Error("Email already used");
      err.statusCode = 409;
      next(err);
      return;
    }
    const employee = new Employee(req.body);
    if (req.body.stage === undefined || req.body.stage === "") {
      employee.stage = "onboarding";
    }
    if (req.body.status === undefined || req.body.status === "") {
      employee.status = "never_submit";
    }
    await employee.save();
    const employeeObj = employee.toObject();
    delete employeeObj.password;
    res.status(200).json(employeeObj);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const getEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params?.employeeId, {
      password: 0,
    }).populate("personInfo");
    if (!employee) {
      const err = new Error("Employee not found");
      err.statusCode = 404;
      next(err);
      return;
    }
    res.status(200).json(employee);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const getAllEmployee = async (req, res, next) => {
  try {
    let page,
      limit = 0;
    let searchQuery = {};
    if (req.query?.page === undefined) {
      page = 1;
    } else {
      page = parseInt(req.query?.page);
    }
    if (req.query?.limit === undefined) {
      limit = 1000;
    } else {
      limit = parseInt(req.query?.limit);
    }
    const skip = (page - 1) * limit;

    if (req.query?.stage !== undefined) {
      searchQuery.stage = req.query?.stage;
    }
    if (req.query?.status !== undefined) {
      searchQuery.status = req.query?.status;
    }
    if (req.query?.isHr !== undefined) {
      searchQuery.isHr = JSON.parse(req.query?.isHr); // "true" or "false" into boolean
    }
    if (req.query?.q !== undefined) {
      searchQuery.$or = [{ username: req.query?.q }, { email: req.query?.q }];
    }

    // Sort by last name
    let query = Employee.find(searchQuery, { password: 0 }).populate(
      "personInfo"
    );

    query = query.sort({
      "personInfo.lastName": 1,
    });

    const employees = await query.skip(skip).limit(limit);
    res.status(200).json(employees);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const linkOpt = async (req, res, next) => {
  try {
    const opt = await Opt.findById(req.body.id);
    if (!opt) {
      const err = new Error("OPT Not Found");
      err.statusCode = 404;
      next(err);
      return;
    }
    if (opt.employeeId.toString() !== req.body.id) {
      const err = new Error("OPT Not Match");
      err.statusCode = 500;
      next(err);
      return;
    }
    const updatedEmployee = await Employee.findOneAndUpdate(
      opt.employeeId,
      { $push: { optList: opt._id } },
      { new: true }
    ).populate("personInfo");
    const { password, ...employeeWithoutPassword } = updatedEmployee;
    res.status(200).json(employeeWithoutPassword);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const unlinkOpt = async (req, res, next) => {
  try {
    const opt = await Opt.findById(req.body.id);
    if (!opt) {
      const err = new Error("OPT Not Found");
      err.statusCode = 404;
      next(err);
      return;
    }
    if (opt.employeeId.toString() !== req.body.id) {
      const err = new Error("OPT Not Match");
      err.statusCode = 500;
      next(err);
      return;
    }
    const updatedEmployee = await Employee.findOneAndUpdate(
      opt.employeeId,
      { $pull: { optList: opt._id } },
      { new: true }
    ).populate("personInfo");
    const { password, ...employeeWithoutPassword } = updatedEmployee;
    res.status(200).json(employeeWithoutPassword);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const makeDecision = async (req, res, next) => {
  try {
    console.log(`makeDecision: START - employeeId=${req.params?.employeeId}, decision=${req.body.decision}`);
    
    // Check if documentType is provided to determine if this is a document-level decision
    const { decision, documentType, feedback } = req.body;
    
    const employee = await Employee.findById(req.params?.employeeId);
    if (!employee) {
      console.log(`makeDecision: ERROR - Employee not found: ${req.params?.employeeId}`);
      const err = new Error("Employee not found");
      err.statusCode = 404;
      next(err);
      return;
    }
    
    // If documentType is provided, this is a document-level approval/rejection
    if (documentType) {
      console.log(`makeDecision: Document-level decision for type=${documentType}`);
      
      // Find the OPT document for this employee and type
      const optDoc = await Opt.findOne({
        employeeId: req.params?.employeeId,
        type: documentType
      }).sort({ createdAt: -1 }); // Get the latest document of this type
      
      if (!optDoc) {
        console.log(`makeDecision: ERROR - ${documentType} document not found`);
        const err = new Error(`${documentType} document not found`);
        err.statusCode = 404;
        next(err);
        return;
      }
      
      if (optDoc.status === "approved" && decision === "approved") {
        console.log(`makeDecision: ERROR - ${documentType} has been approved`);
        const err = new Error(`${documentType} has already been approved`);
        err.statusCode = 400;
        next(err);
        return;
      }
      
      // Update the document status
      optDoc.status = decision;
      if (decision === "rejected" && feedback) {
        optDoc.feedback = feedback;
      }
      await optDoc.save();
      
      console.log(`makeDecision: Updated ${documentType} status to ${decision}`);
      
      // If the document is approved, check if it's the current stage document
      // and if so, advance the employee's stage and status
      if (decision === "approved") {
        const stageOrder = ["onboarding", "OPT Receipt", "OPT EAD", "I-983", "I-20"];
        const employeeStageIndex = stageOrder.indexOf(employee.stage);
        const docStageIndex = stageOrder.indexOf(documentType);
        
        console.log(`makeDecision: employeeStageIndex=${employeeStageIndex}, docStageIndex=${docStageIndex}`);
        
        // If the document is for the next stage after employee's current stage, advance the stage
        if (docStageIndex === employeeStageIndex + 1 || 
            (employeeStageIndex === 0 && documentType === "OPT Receipt" && employee.status === "approved")) {
          // Advance the stage
          employee.stage = documentType;
          employee.status = "approved";
          const currentDate = new Date();
          employee.submissionDate = currentDate.toLocaleDateString("en-CA");
          await employee.save();
          console.log(`makeDecision: Advanced employee stage to ${documentType}`);
        } else if (docStageIndex === employeeStageIndex) {
          // If the document is for the current stage, just update the status
          if (employee.status === "pending") {
            employee.status = "approved";
            await employee.save();
            console.log(`makeDecision: Updated employee status to approved for stage ${documentType}`);
          }
        }
      }
      
      return res.status(200).json({ 
        stage: employee.stage, 
        status: employee.status,
        documentStatus: optDoc.status 
      });
    }
    
    // Original logic: Employee-level decision (for onboarding or other general approvals)
    console.log(`makeDecision: Employee-level decision for employee._id=${req.params?.employeeId}, employee.stage=${employee.stage}, employee.status=${employee.status}, decision=${decision}`);
    
    if (employee.status === "approved") {
      console.log(`makeDecision: ERROR - This stage has been approved`);
      const err = new Error("This stage has been approved");
      err.statusCode = 400;
      next(err);
      return;
    }
    
    if (decision === "approved") {
      employee.status = "approved";
    } else if (decision === "rejected") {
      employee.status = "rejected";
      employee.feedback = feedback;
    } else {
      const err = new Error("Wrong decision content");
      err.statusCode = 500;
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

const makeAdvance = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params?.employeeId);
    if (employee.status !== "approved") {
      const err = new Error("Current stage not approved");
      err.statusCode = 500;
      next(err);
      return;
    }
    if (employee.stage === "onboarding") {
      employee.stage = "OPT Receipt";
    } else if (employee.stage === "OPT Receipt") {
      employee.stage = "OPT EAD";
    } else if (employee.stage === "OPT EAD") {
      employee.stage = "I-983";
    } else if (employee.stage === "I-983") {
      employee.stage = "I-20";
    } else if (employee.stage === "I-20") {
      const err = new Error("I-20 stage is the last stage");
      err.statusCode = 500;
      next(err);
      return;
    }
    const currentDate = new Date();
    employee.submissionDate = currentDate.toLocaleDateString("en-CA");
    await employee.save();
    res.status(200).json({ stage: employee.stage, status: employee.status });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

module.exports = {
  createEmployee,
  getEmployee,
  getAllEmployee,
  linkOpt,
  unlinkOpt,
  makeDecision,
  makeAdvance,
};
