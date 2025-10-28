const createEmployee = async (req, res, next) => {
  try {
    res.status(200);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const getEmployee = async (req, res, next) => {
  try {
    res.status(200);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const getAllEmployee = async (req, res, next) => {
  try {
    res.status(200);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const linkOpt = async (req, res, next) => {
  try {
    res.status(200);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const unlinkOpt = async (req, res, next) => {
  try {
    res.status(200);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const makeDecision = async (req, res, next) => {
  try {
    res.status(200);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const makeAdvance = async (req, res, next) => {
  try {
    res.status(200);
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
