const Employee = require("../models/Employee.js");
const Doc = require("../models/Doc.js");
const Opt = require("../models/Opt.js");

const createOpt = async (req, res, next) => {
  try {
    const doc = await Doc.findById(req.body.doc);
    if (!doc) {
      const err = new Error("Document not found");
      err.statusCode = 404;
      next(err);
      return;
    }
    const employee = await Employee.findById(req.body.employee_id);
    if (!employee) {
      const err = new Error("Employee not found");
      err.statusCode = 404;
      next(err);
      return;
    }
    const opt = new Opt({
      type: req.body.type,
      doc: req.body.doc,
      employeeId: req.body.employee_id,
    });
    await opt.save();
    
    // Add to Employee
    await Employee.updateOne(
      { _id: req.body.employee_id },
      { $push: { optList: opt._id } }
    );
    
    // Auto-update employee status based on document type
    // Set status to pending when employee uploads a document for their current or next stage
    // Define the stage for each document type
    const documentStageMap = {
      "OPT Receipt": ["onboarding", "OPT Receipt"],
      "OPT EAD": ["OPT Receipt", "OPT EAD"],
      "I-983": ["OPT EAD", "I-983"],
      "I-20": ["I-983", "I-20"]
    };
    
    const allowedStages = documentStageMap[req.body.type];
    console.log(`createOpt: type=${req.body.type}, employee.stage=${employee.stage}, employee.status=${employee.status}, allowedStages=${JSON.stringify(allowedStages)}`);
    if (allowedStages && allowedStages.includes(employee.stage)) {
      console.log(`createOpt: Setting status to pending for employee ${req.body.employee_id}`);
      await Employee.updateOne(
        { _id: req.body.employee_id },
        { $set: { status: "pending", submissionDate: new Date().toISOString().slice(0, 10) } }
      );
    } else {
      console.log(`createOpt: NOT updating status - stage not in allowed list or allowedStages is null`);
    }
    
    res.status(200).json(opt);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const getOpts = async (req, res, next) => {
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
      limit = 10;
    } else {
      limit = parseInt(req.query?.limit);
    }
    const skip = (page - 1) * limit;

    if (req.query?.employee_id !== undefined) {
      searchQuery.employeeId = req.query?.employee_id;
    }
    if (req.query?.type !== undefined) {
      searchQuery.type = req.query?.type;
    }

    // New to old
    const opts = await Opt.find(searchQuery)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    res.status(200).json(opts);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const getOpt = async (req, res, next) => {
  try {
    const opt = await Opt.findById(req.params?.optId);
    if (!opt) {
      const err = new Error("Opt not found");
      err.statusCode = 404;
      next(err);
      return;
    }
    res.status(200).json(opt);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const deleteOpt = async (req, res, next) => {
  try {
    const opt = await Opt.deleteOne({ _id: req.params?.optId });
    await Employee.updateOne(
      { _id: opt.employeeId },
      { $pull: { optList: req.params?.optId } }
    );
    res.status(200).json({ id: req.params?.optId, deleted: true });
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

module.exports = {
  createOpt,
  getOpts,
  getOpt,
  deleteOpt,
};
