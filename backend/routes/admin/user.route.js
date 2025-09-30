// routes/user.routes.js
import express from "express";
import userController from "../../controller/admin/user.controller.js";

const userRoutes = express.Router();


userRoutes.post("/ghost-login/:userId", userController.ghostUserLogin);

userRoutes.post("/user-invite", userController.inviteUser);

userRoutes.get("/", userController.getAllUsers);
userRoutes.get("/:id", userController.getUserById);
userRoutes.put("/:id", userController.updateUser);
userRoutes.delete("/:id", userController.deleteUser);

export default userRoutes;
