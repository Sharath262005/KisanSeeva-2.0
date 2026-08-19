import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

const isNative = () => Capacitor.isNativePlatform();

// ─── Permission ──────────────────────────────────────────────────────────────
export async function requestNotificationPermissions(): Promise<boolean> {
  if (!isNative()) return false;
  try {
    const localPerm = await LocalNotifications.requestPermissions();
    return localPerm.display === "granted";
  } catch {
    return false;
  }
}

// ─── Local notification (OS taskbar bubble) ──────────────────────────────────
let localNotifId = 1000;

export async function scheduleLocalNotification(
  title: string,
  body: string,
  id?: number
): Promise<void> {
  if (!isNative()) return;
  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: id ?? localNotifId++,
          title,
          body,
          schedule: { at: new Date(Date.now() + 300) },
          sound: "default",
          smallIcon: "ic_stat_kisanseeva",
          channelId: "kisanseeva_alerts",
        },
      ],
    });
  } catch (e) {
    console.warn("[Notif] scheduleLocalNotification error:", e);
  }
}

// ─── Notification tap action handler ─────────────────────────────────────────
export function setupNotificationActionListener(
  onAction: (notificationId: number) => void
) {
  if (!isNative()) return;
  try {
    LocalNotifications.addListener("localNotificationActionPerformed", (action) => {
      onAction(action.notification.id);
    });
  } catch { /* ignore */ }
}

// ─── Create notification channel (Android 8+) ────────────────────────────────
export async function createNotificationChannel(): Promise<void> {
  if (!isNative()) return;
  try {
    await LocalNotifications.createChannel({
      id: "kisanseeva_alerts",
      name: "KisanSeeva Alerts",
      description: "Booking, survey and service notifications",
      importance: 4, // HIGH
      vibration: true,
      sound: "default",
    });
  } catch { /* channel may already exist */ }
}

// ─── Deep link route extractor from notification message ─────────────────────
export function getRouteFromMessage(message: string, userRole: string): string | null {
  const lower = message.toLowerCase();
  if (/booking/i.test(lower))  return `/${userRole}/bookings`;
  if (/survey/i.test(lower))   return `/${userRole}/surveys`;
  if (/complaint/i.test(lower)) return `/${userRole}/complaints`;
  if (/payment|earning|bill/i.test(lower)) return userRole === "provider" ? "/provider/earnings" : "/farmer/bookings";
  if (/rating|rated|star/i.test(lower)) return `/${userRole}/bookings`;
  return null;
}
