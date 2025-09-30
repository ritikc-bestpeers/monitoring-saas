import mongoose from "mongoose";

const UserInviteSchema = new mongoose.Schema({
  email: { type: String, required: true },
  token: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  used: { type: Boolean, default: false },
});

export default mongoose.model("UserInvite", UserInviteSchema);
