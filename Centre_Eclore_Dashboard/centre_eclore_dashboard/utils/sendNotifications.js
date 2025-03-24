// utils/sendNotifications.js
import axios from "axios";

export async function sendNotification(title, message, data = {}) {
  // These should be in your environment variables
  const APP_ID = process.env.APP_ID;
  const API_KEY = process.env.API_KEY;

  if (!APP_ID || !API_KEY) {
    console.error("OneSignal credentials missing. Check your environment variables.");
    return;
  }

  const notificationData = {
    app_id: APP_ID,
    included_segments: ["All"], // Send to all subscribed users
    contents: { en: message },
    headings: { en: title },
  };

  try {
    const response = await axios.post("https://onesignal.com/api/v1/notifications", notificationData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${API_KEY}`,
      },
    });
    console.log("Notification sent successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error sending notification:", error.response?.data || error.message);
    throw error;
  }
}