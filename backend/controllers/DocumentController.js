const Doc = require("../models/Doc.js");
const path = require("path");
const fs = require("fs");

const createDoc = async (req, res, next) => {
  try {
    console.log("createDoc called, req.file:", req.file);
    console.log("req.body:", req.body);
    
    if (req.file) {
      // Verify file was actually saved to disk
      const filePath = path.join(req.file.destination, req.file.filename);
      const fileExists = fs.existsSync(filePath);
      
      console.log("File path:", filePath);
      console.log("File exists:", fileExists);
      console.log("File info:", {
        originalname: req.file.originalname,
        filename: req.file.filename,
        size: req.file.size,
        mimetype: req.file.mimetype
      });
      
      if (!fileExists) {
        console.error("File was not saved to disk:", filePath);
        const err = new Error("File was not saved to disk");
        err.statusCode = 500;
        next(err);
        return;
      }
      
      const doc = new Doc({
        url: `http://localhost:3000/fileStorage/${req.file.filename}`,
        fileType: req.body.fileType,
      });
      await doc.save();
      console.log("Document saved to database:", doc._id);
      res.status(200).json(doc);
    } else {
      console.error("No file in request");
      const err = new Error("File upload failed - no file received");
      err.statusCode = 400;
      next(err);
      return;
    }
  } catch (err) {
    console.error("Error in createDoc:", err);
    err.statusCode = err.statusCode || 500;
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
