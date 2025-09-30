"use client";

import { useEffect } from "react";
import api from "@/lib/axios";

export default function PushSetup() {
  useEffect(() => {
    console.log("hello")
    if ("serviceWorker" in navigator && "PushManager" in window) {
      navigator.serviceWorker.register("/sw.js").then(async (registration) => {
          const permission = await Notification.requestPermission();
          console.log(permission)
        if (permission !== "granted") return;

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
        });

        await api.post("/auth/notification-subscribe", {subscription});

        console.log('ehlo')
      });
    }
  }, []);

  return <p>Push notifications enabled ✅</p>;
}
