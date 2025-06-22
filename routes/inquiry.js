import express from "express";
import { Inquiry as inquiryController } from "../controller/inquiryController.js";
const router = express.Router();
router.post("/", inquiryController);
export default router;
