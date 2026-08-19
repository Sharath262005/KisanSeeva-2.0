import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const frontendDir = path.resolve("c:/Projects/v3-coders/frontend");
const androidDir = path.resolve("c:/Projects/v3-coders/frontend/android");
const outputApksDir = path.resolve("c:/Projects/v3-coders/apks");
const buildGradlePath = path.join(androidDir, "app/build.gradle");
const capConfigPath = path.join(frontendDir, "capacitor.config.ts");

if (!fs.existsSync(outputApksDir)) {
  fs.mkdirSync(outputApksDir, { recursive: true });
}

const apps = [
  { name: "Farmer", mode: "farmer", id: "com.kisanseeva.farmer", appName: "KisanSeeva Farmer", fileName: "KisanSeeva-Farmer.apk" },
  { name: "Provider", mode: "provider", id: "com.kisanseeva.provider", appName: "KisanSeeva Partner", fileName: "KisanSeeva-Provider.apk" },
  { name: "Admin", mode: "admin", id: "com.kisanseeva.admin", appName: "KisanSeeva Admin", fileName: "KisanSeeva-Admin.apk" },
];

for (const app of apps) {
  console.log(`\n========================================`);
  console.log(`🔨 Building Standalone ${app.name} App (${app.id})...`);
  console.log(`========================================\n`);

  // Update android/app/build.gradle applicationId and namespace
  if (fs.existsSync(buildGradlePath)) {
    let gradleContent = fs.readFileSync(buildGradlePath, "utf-8");
    gradleContent = gradleContent.replace(/namespace\s+["'].*?["']/, `namespace "${app.id}"`);
    gradleContent = gradleContent.replace(/applicationId\s+["'].*?["']/, `applicationId "${app.id}"`);
    fs.writeFileSync(buildGradlePath, gradleContent, "utf-8");
  }

  // Update capacitor.config.ts appId and appName
  if (fs.existsSync(capConfigPath)) {
    let capContent = fs.readFileSync(capConfigPath, "utf-8");
    capContent = capContent.replace(/appId:\s*['"].*?['"]/, `appId: '${app.id}'`);
    capContent = capContent.replace(/appName:\s*['"].*?['"]/, `appName: '${app.appName}'`);
    fs.writeFileSync(capConfigPath, capContent, "utf-8");
  }

  // 🎨 Swap launcher icons for this specific app role (distinct icon per APK)
  console.log(`🎨 Setting up icons for ${app.name} app...`);
  execSync(`node setup_app_icons.js ${app.mode}`, { cwd: frontendDir, stdio: "inherit" });
  console.log(`✅ Icons updated for ${app.name}\n`);

  // 1. Build Vite web assets for this mode
  execSync(`npm run build:${app.mode}`, { cwd: frontendDir, stdio: "inherit" });

  // 2. Sync into Capacitor Android project
  execSync(`npx cap copy android`, { cwd: frontendDir, stdio: "inherit" });

  // 3. Assemble Android APK using Gradle
  execSync(`cmd /c "gradlew.bat assembleDebug"`, { cwd: androidDir, stdio: "inherit" });

  // 4. Copy resulting APK to /apks folder
  const sourceApk = path.join(androidDir, "app/build/outputs/apk/debug/app-debug.apk");
  const targetApk = path.join(outputApksDir, app.fileName);

  if (fs.existsSync(sourceApk)) {
    fs.copyFileSync(sourceApk, targetApk);
    console.log(`✅ Successfully generated ${app.name} APK: ${targetApk}`);
  } else {
    console.error(`❌ Could not find compiled APK for ${app.name} at ${sourceApk}`);
  }
}

console.log(`\n🎉 ALL 3 SEPARATE STANDALONE APKS GENERATED IN: ${outputApksDir}\n`);
