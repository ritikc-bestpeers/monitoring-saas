import webPush from "web-push";
import { CONFIG } from "../config/config.js";

webPush.setVapidDetails(
  "mailto:admin@monitoringsaas.com",
  CONFIG.VAPID_PUBLIC_KEY,
  CONFIG.VAPID_PRIVATE_KEY
);

export default webPush;
