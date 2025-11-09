
import express from "express";
import fs from "fs";
import pdfParse from "pdf-parse";
import upload from "../middleware/uploadMiddleware.js";
import {
  getParser,
  detectBank,
  isParserAvailable,
} from "../parsers/index.js";

const router = express.Router();

router.post("/parse-statement", upload.single("file"), async (req, res) => {
  let filePath = null;

  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded. Please upload a PDF file.",
      });
    }

    filePath = req.file.path;

    const dataBuffer = fs.readFileSync(filePath);

    const pdfData = await pdfParse(dataBuffer);
    const extractedText = pdfData.text;

    const detectedBank = detectBank(extractedText);

    if (!detectedBank) {
      return res.status(400).json({
        success: false,
        error: "Unable to detect bank from the statement. Please ensure you're uploading a valid credit card statement from HDFC, ICICI, Axis, SBI, or Kotak Bank.",
      });
    }

    if (!isParserAvailable(detectedBank)) {
      return res.status(501).json({
        success: false,
        error: `Parser for "${detectedBank}" is not yet implemented.`,
      });
    }

    const parser = getParser(detectedBank);

    const parsedData = parser(extractedText);

    if (!parsedData || Object.keys(parsedData).length === 0) {
      throw new Error("Failed to extract data from the statement");
    }

    res.json({
      success: true,
      parsed: parsedData,
      detectedBank: detectedBank,
    });
  } catch (error) {
    console.error("Parse statement error:", error);

    let statusCode = 500;
    if (error.message.includes("not supported") || error.message.includes("Unable to detect")) {
      statusCode = 400;
    } else if (error.message.includes("not yet implemented")) {
      statusCode = 501;
    } else if (error.message.includes("Invalid file")) {
      statusCode = 400;
    }

    res.status(statusCode).json({
      success: false,
      error: error.message || "Failed to parse PDF statement",
    });
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });
    }
  }
});


export default router;