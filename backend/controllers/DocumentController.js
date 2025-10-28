const createDoc = async (req, res, next) => {
  try {
    res.status(200);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const getDoc = async (req, res, next) => {
  try {
    res.status(200);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

module.exports = {
  createDoc,
  getDoc,
};
