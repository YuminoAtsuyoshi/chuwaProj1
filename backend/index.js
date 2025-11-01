const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const employeeRouter = require("./routers/employee");
const employeeInfoRouter = require("./routers/employeeInfo");
const authRouter = require("./routers/auth");
const docsRouter = require("./routers/docs");
const optsRouter = require("./routers/opts");
const tokensRouter = require("./routers/tokens");
const errorHandlerMiddleware = require("./middlewares/errorHandler");
const app = express();
const fs = require("fs");
const path = require("path");
const UPLOAD_DIR = path.join(__dirname, "uploads");

connectDB();

app.use(
  cors({
    origin: "*",
  })
);

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/employees", employeeRouter);
app.use("/api/employee-info", employeeInfoRouter);
app.use("/api/auth", authRouter);
app.use("/api/docs", docsRouter);
app.use("/api/opts", optsRouter);
app.use("/api/registration-tokens", tokensRouter);

// Health Check API
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Backend is running" });
});
// Get image & pdf file
app.get("/fileStorage/:filename", (req, res) => {
  const filename = req.params.filename;
    const filePath = path.join(UPLOAD_DIR, filename);
  
  // Check if file exists first
  fs.access(filePath, fs.constants.F_OK, (accessErr) => {
    if (accessErr) {
      console.error("File not found: ", filePath);
      if (!res.headersSent) {
        res.status(404).send("File not found.");
      }
      return;
    }
    
    // File exists, proceed to read it
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.error("Error reading file: ", err);
        if (!res.headersSent) {
          res.status(500).send("Error reading file.");
        }
        return;
      }
      
      if (res.headersSent) {
        return; // Response already sent
      }
      
      if (filename.endsWith(".pdf")) {
      res.setHeader("Content-Type", "application/pdf");
      res.status(200).send(data);
  } else {
    // jpg & png
      let contentType = "application/octet-stream"; // Default
      if (filename.endsWith(".png")) {
        contentType = "image/png";
      } else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
        contentType = "image/jpeg";
      }
      res.setHeader("Content-Type", contentType);
      res.status(200).send(data);
      }
    });
  });
});

app.use(errorHandlerMiddleware);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
  console.log(`Health check: http://localhost:3000/health`);
});
