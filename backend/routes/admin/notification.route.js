import express from "express";
import webPush from "../../utils/webPush.js";
import Subscription from "../../models/web_push_subscriptions.model.js";

const notificationRoutes = express.Router();

// Save subscription
notificationRoutes.post("/subscribe", async (req, res) => {
  try {
    const { userId, subscription } = req.body;

    if (!userId || !subscription) {
      return res.status(400).json({ success: false, message: "userId and subscription are required" });
    }

    // Upsert subscription (1 user = 1 subscription, replace if exists)
    await Subscription.findOneAndUpdate(
      { userId },
      { subscription },
      { upsert: true, new: true }
    );

    res.json({ success: true, message: "Subscription saved" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send notification to all
notificationRoutes.post("/send", async (req, res) => {
  try {
    const { title, body } = req.body;
    const payload = JSON.stringify({ title, body });

    const subscriptions = await Subscription.find();

    const results = await Promise.all(
      subscriptions.map(async (subDoc) => {
        try {
          await webPush.sendNotification(subDoc.subscription, payload);
          return { userId: subDoc.userId, success: true };
        } catch (err) {
          console.error("Push error", err);
          return { userId: subDoc.userId, success: false };
        }
      })
    );

    res.json({ success: true, results });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Send notification to one user
notificationRoutes.post("/send/:userId", async (req, res) => {
  try {
    const { title, body } = req.body;
    const payload = JSON.stringify({ title, body });

    const subDoc = await Subscription.findOne({ userId: req.params.userId });
    if (!subDoc) return res.status(404).json({ success: false, message: "No subscription for user" });

    await webPush.sendNotification(subDoc.subscription, payload);

    res.json({ success: true, message: "Notification sent" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default notificationRoutes;
