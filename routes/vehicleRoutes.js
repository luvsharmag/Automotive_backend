import express from "express";
const router = express.Router();
import {
  getVehicles,
  getVehicle,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../controller/vehicleController.js";

router.get("/", getVehicles);
router.get("/:id", getVehicle);


router.post("/", createVehicle);
router.put("/:id", updateVehicle);
router.delete("/:id", deleteVehicle);

export default router;
