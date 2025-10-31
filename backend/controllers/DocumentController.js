const Doc = require("../models/Doc.js");

const createDoc = async (req, res, next) => {
  try {
    if (req.file) {
      const doc = new Doc({
        url: `http://localhost:3000/fileStorage/${req.file.filename}`,
      });
      await doc.save();
      res.status(200).json(doc);
    } else {
      const err = new Error("File upload failed");
      err.statusCode = 404;
      next(err);
      return;
    }
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

const getDoc = async (req, res, next) => {
  try {
    const doc = await Doc.findById(req.params?.docId);
    res.status(200).json(doc);
  } catch (err) {
    err.statusCode = 500;
    next(err);
  }
};

module.exports = {
  createDoc,
  getDoc,
};
