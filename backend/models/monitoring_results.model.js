// models/monitorResult.model.js
import mongoose from "mongoose";

const monitorResultSchema = new mongoose.Schema(
  {
    monitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Monitoring",
      required: true,
    },
    status: {
      type: String,
      enum: ["up", "down"],
      required: true,
    },
    responseTime: {
      type: Number, // in ms
      default: null,
    },
    statusCode: {
      type: Number,
      default: null,
    },
    error: {
      type: String,
      default: null,
    },
    checkedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const MonitoringResult = mongoose.model("MonitoringResult_ts", monitorResultSchema);

export default MonitoringResult;
