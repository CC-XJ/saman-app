# saman-app

## ⚡ Cordova setup & usage

Basic Cordova tasks (Cordova is installed locally as a devDependency):

- **Prepare**: `npm run cordova:prepare`
- **Build**: `npm run cordova:build`
- **Run in browser**: `npm run cordova:run:browser`
- **Add browser platform**: `npm run cordova:add-platform-browser`
- **Add Android platform**: `npm run cordova:add-platform-android` (requires Android SDK/Gradle on your machine)

Notes:
- The `browser` platform lets you run and test the app without native SDKs.
- Native platforms (Android/iOS) require their respective SDK/toolchains installed and configured.
