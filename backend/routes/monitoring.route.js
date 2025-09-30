import express from "express";
import monitoringController from "../controller/monitoring.controller.js";

const monitoringRoutes = express.Router();

monitoringRoutes.get("/", monitoringController.getMonitoring)

monitoringRoutes.post("/", monitoringController.startMonitoring);

monitoringRoutes.put("/status/:monitorId/:status", monitoringController.changeMonitoringStatus);

monitoringRoutes.delete("/:monitorId", monitoringController.deleteMonitoring);

export default monitoringRoutes;