import { Router } from "express";
import { vehiclesController } from "./vehicles.controller";

const router = Router();

router.post("/", vehiclesController.createVehicle);
router.get("/", vehiclesController.getAllVehicles);
router.get("/:vehicleId", vehiclesController.getVehicleDetails);
router.put("/:vehicleId", vehiclesController.updateVehicleDetails);
router.delete("/:vehicleId", vehiclesController.deleteVehicle);

export const vehiclesRoute = router;
