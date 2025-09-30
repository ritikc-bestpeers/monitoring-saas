import mongoose from "mongoose";

const MonitoringSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    name: {
        type: String, 
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    frequencySec: {
        type: Number,
        required: false,
        default: 60
    },
    status: { 
        type: String, 
        enum: ["active", "paused", "terminated"], 
        default: "active" 
    },
    siteStatus: {
        type: String,
        enum: ["down", "up"], 
        default: "up" 
    },
    repeatJobKey: {
        type: String,
        required: false,
        default: null
    }
}, {
    timestamps: true
});

export default mongoose.model("Monitoring", MonitoringSchema);