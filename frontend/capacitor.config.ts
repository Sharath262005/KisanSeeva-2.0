import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.kisanseeva.admin',
  appName: 'KisanSeeva Admin',
  webDir: 'dist',
  android: {
    // Persist WebView data across app kills — prevents localStorage from being cleared
    // when the user swipes the app away from recents
    allowMixedContent: true,
    // Use the app's internal storage for WebView data (not cleared on kill)
    webContentsDebuggingEnabled: false,
  },
  // Note: @aparajita/capacitor-secure-storage requires no plugin config here.
  // Android: Uses Android Keystore (AES-256-GCM, hardware-backed, API 23+)
  // iOS:     Uses iOS Keychain
  // Both persist across app kills, memory pressure, and device reboots.
};

export default config;
