const getEmployeeInfo = async (req, res, next) => {
  try {
    res.status(200);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const updateEmployeeInfo = async (req, res, next) => {
  try {
    res.status(200);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const submitForm = async (req, res, next) => {
  try {
    res.status(200);
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
