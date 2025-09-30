import mongoose from "mongoose";

const WebPushSubscription = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subscription: { type: Object, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("WebPushSubscription", WebPushSubscription);
