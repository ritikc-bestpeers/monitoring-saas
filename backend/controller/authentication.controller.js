import globalErrorHandler from "../middlewares/globalErrorHandler.js";
import User from "../models/user.model.js";
import UserInvite from "../models/user_invite.model.js";
import WebPushSubscription from "../models/web_push_subscriptions.model.js";
import { generateToken } from "../utils/jwt.js";
import validate from "../utils/validate.js";
import authenticationValidations from "../validations/authentication.validations.js";
import bcrypt from "bcryptjs";

const register = async (req, res) => {
  try {
    let data = validate(authenticationValidations.register, req.body);

    let existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "Email already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password, salt);

    const user = await User.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    const token = generateToken({ id: user._id, email: user.email });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user: { id: user._id, name: user.name, email: user.email },
        token,
      },
    });
  } catch (error) {
    globalErrorHandler(error, req, res);
  }
};

const login = async (req, res, next) => {
  try {
    let data = validate(authenticationValidations.login, req.body);

    let user = await User.findOne({ email: data.email }).select("+password");
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    let matched = await bcrypt.compare(data.password, user.password);
    if (!matched) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }

    let token = generateToken({ id: user._id, email: user.email });

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: { id: user._id, name: user.name, email: user.email },
        token,
      },
    });
  } catch (error) {
    globalErrorHandler(error, req, res, next);
  }
};

const acceptInvite = async (req, res) => {
  try {
    const { token, name, password } = req.body;

    const invite = await UserInvite.findOne({ token, used: false });
    if (!invite) return res.status(400).json({ message: "Invalid token" });
    if (invite.expiresAt < new Date())
      return res.status(400).json({ message: "Token expired" });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
      name: name,
      email: invite.email,
      password: hashed,
      role: "user",
    });
    await user.save();

    invite.used = true;
    await invite.save();

    let jwtToken = generateToken({ id: user._id, email: user.email });

    res.json({
      success: true,
      message: "Account created successfully!",
      data: {
        user: { id: user._id, name: user.name, email: user.email },
        token: jwtToken,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const profile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    res.status(200).json({
      success: true,
      message: "Profile fetched successful",
      data: { user },
    });
  } catch (error) {
    globalErrorHandler(error, req, res, next);
  }
};

const webPushSubscription = async (req, res, next) => {
  try {
    const { subscription } = req.body;

    if (!subscription) {
      return res.status(400).json({ success: false, message: "Subscription is required" });
    }

    await WebPushSubscription.findOneAndUpdate(
      { userId: req.user.id },
      { subscription },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: "Subscription saved" });
  } catch (error) {
    globalErrorHandler(error, req, res, next);
  }
};


export default { register, login, profile, acceptInvite, webPushSubscription };
