import express from "express";
import trackSSLMonitoringController from "../controller/track_ssl.controller.js";

const trackSSLRoutes = express.Router();

trackSSLRoutes.get("/", trackSSLMonitoringController.getSSLDomains)

trackSSLRoutes.post("/", trackSSLMonitoringController.startMonitoring);

trackSSLRoutes.put("/status/:monitorId/:status", trackSSLMonitoringController.changeMonitoringStatus);

trackSSLRoutes.delete("/:monitorId", trackSSLMonitoringController.deleteMonitoring);

export default trackSSLRoutes;