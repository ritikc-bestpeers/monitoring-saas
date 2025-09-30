import crypto from "crypto";
import globalErrorHandler from "../../middlewares/globalErrorHandler.js";
import User from "../../models/user.model.js";
import UserInvite from "../../models/user_invite.model.js";
import { generateToken } from "../../utils/jwt.js";

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("id name email createdAt");
    res.json({ success: true, data: users });
  } catch (error) {
    globalErrorHandler(error, req, res);
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "id name email createdAt"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error) {
    globalErrorHandler(error, req, res);
  }
};

const updateUser = async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("id name email createdAt");
    if (!updated) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, data: updated });
  } catch (error) {
    globalErrorHandler(error, req, res);
  }
};

const deleteUser = async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, message: "User deleted" });
  } catch (error) {
    globalErrorHandler(error, req, res);
  }
};

const ghostUserLogin = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // generate token for that user
    const token = generateToken({ id: user._id, email: user.email });

    res.json({
      success: true,
      token,
      user,
    });
  } catch (error) {
    globalErrorHandler(error, req, res);
  }
};

const inviteUser = async (req, res) => {
  try {
    const { email } = req.body;

    const token = crypto.randomBytes(32).toString("hex");

    const invite = new UserInvite({
      email,
      token,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
    });
    await invite.save();

    const link = `${process.env.FRONTEND_URL}/accept-invite?token=${token}`;
    // await sendEmail(email, "You're invited!", `Click here to join: ${link}`);
    console.log("You're invited!", `Click here to join: ${link}`);

    res.json({ success: true, message: "Invite sent successfully!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export default {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  ghostUserLogin,
  inviteUser,
};
