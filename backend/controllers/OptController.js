const createOpt = async (req, res, next) => {
  try {
    res.status(200);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const getOpts = async (req, res, next) => {
  try {
    res.status(200);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const getOneOpt = async (req, res, next) => {
  try {
    res.status(200);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const deleteOpt = async (req, res, next) => {
  try {
    res.status(200);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

module.exports = {
  createOpt,
  getOpts,
  getOneOpt,
  deleteOpt,
};
