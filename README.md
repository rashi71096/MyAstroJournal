# Astro Journal App

A beautiful React Native mobile journal app that combines daily horoscopes with personal journaling. Write your thoughts while staying connected to the cosmos!

## Features

- **Daily Horoscopes**: Get personalized horoscopes for all 12 zodiac signs
- **Personal Journaling**: Write and save daily journal entries
- **Offline Support**: Access your journal entries even without internet
- **Local Storage**: SQLite database for secure, local data storage

## Getting Started

### Prerequisites

- Node.js (v20.19.4 recommended)
- React Native development environment
- iOS Simulator or Android Emulator

### Installation

1. **Clone and navigate to the project**:
   ```bash
   cd MyAstroJournal
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install iOS dependencies**:
   ```bash
   cd ios && pod install && cd ..
   ```

4. **Start Metro bundler**:
   ```bash
   npm start
   ```

5. **Run the app**:
   ```bash
   # For iOS
   npm run ios
   
   # For Android
   npm run android
   ```

## Android Build Steps (Complete Clean Build)

If you need to perform a complete clean build for Android:

1. **Clean build directories**:
   ```bash
   # Remove Android build directory
   cd android && ./gradlew clean && cd ..
   ```

2. **Reinstall dependencies**:
   ```bash
   # Install npm packages
   npm install
   ```

3. **Build and run**:
   ```bash
   # Start Metro bundler
   npm start
   
   # In a new terminal, run Android app
   npm run android
   ```

## iOS Build Steps (Complete Clean Build)

If you need to perform a complete clean build for iOS:

1. **Clean build directories**:
   ```bash
   # Remove iOS build directory
   rm -rf ios/build
   
   # Clean CocoaPods
   cd ios && rm -rf Pods Podfile.lock && cd ..
   ```

2. **Reinstall dependencies**:
   ```bash
   # Install npm packages
   npm install
   
   # Install iOS dependencies (this may take 10-15 minutes)
   cd ios && pod install && cd ..
   ```

3. **Build and run**:
   ```bash
   # Start Metro bundler
   npm start
   
   # In a new terminal, run iOS app
   npm run ios
   ```

## Troubleshooting

If you encounter issues:

1. **Clean and rebuild**:
   ```bash
   npm start -- --reset-cache
   cd ios && pod install && cd ..
   ```

2. **iOS build permission errors**:
   ```bash
   # If you get "Could not delete build directory" error
   rm -rf ios/build
   cd ios && pod install && cd ..
   ```

3. **Check Node.js version**: Ensure you're using Node.js v20.19.4
4. **Simulator issues**: Try restarting your iOS Simulator or Android Emulator