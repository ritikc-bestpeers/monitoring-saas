import express from "express";
import authenticationController from "../controller/authentication.controller.js";
import authentication from "../middlewares/authentication.js";

const authenticationRoutes = express.Router();

authenticationRoutes.post("/register", authenticationController.register);

authenticationRoutes.post("/login", authenticationController.login);

authenticationRoutes.post("/accept-invite", authenticationController.acceptInvite);

authenticationRoutes.post("/notification-subscribe", authentication, authenticationController.webPushSubscription);

authenticationRoutes.get("/profile", authentication, authenticationController.profile);

export default authenticationRoutes;