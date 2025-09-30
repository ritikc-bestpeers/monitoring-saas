// models/trackSSL.model.js
import mongoose from "mongoose";

const trackSSLSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    domain: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "paused"],
      default: "active",
    },
    validFrom: {
      type: Date,
      required: false,
    },
    validTo: {
      type: Date,
      required: false,
    },
    daysRemaining: {
      type: Number,
      required: false,
    },
    issuer: {
      type: String,
      required: false,
    },
    sslStatus: {
      type: String,
      enum: ["valid", "expiring_soon", "expired", "error"],
      required: true,
    },
    repeatJobKey: {
      type: String,
      required: false,
      default: null,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const TrackSSL = mongoose.model("TrackSSL", trackSSLSchema);

export default TrackSSL;
