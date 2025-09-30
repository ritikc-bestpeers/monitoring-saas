import express from "express";
import authenticationRoutes from "./authentication.route.js";
import monitoringRoutes from "./monitoring.route.js";
import userRoutes from "./user.route.js";
import monitoringResultsRoutes from "./monitoring_results.route.js";
import trackSSLRoutes from "./track_ssl.route.js"
import authentication from "../middlewares/authentication.js";
import adminRoutes from "./admin/index.route.js";

const router = express.Router();


router.get("/health-check", (req, res) => {
    res.send("OK")
})



router.use('/auth', authenticationRoutes);

router.use('/monitoring', authentication, monitoringRoutes);

router.use('/monitoring-results', authentication, monitoringResultsRoutes);

router.use('/track-ssl', authentication, trackSSLRoutes);

router.use('/users', userRoutes);

router.use("/admin", adminRoutes)

export default router;