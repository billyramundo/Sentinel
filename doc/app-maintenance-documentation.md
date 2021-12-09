## Install Instructions

## Update or Change Key Non-Programming Components
To change database information, one would need to be granted ownership access to our Firebase Sentinel database linked here: https://console.firebase.google.com/u/1/project/sentinel-a6249/overview. Then, they would be able to change both the rules and the information stored here. 
The web infrastructure is expandable and allows for, say, switching to another domain instead of tunnel.kundu.io in the future. If these things were changed, which is unlikely, because they are inextricably linked in the source code, it would be by means of an update. 

## Open Source Tools and Libraries
Back end: pyrebase, flask, localtunnel

Database: firebase

Front end: axios, expo-status-bar, react, react-native, react-navigation, react-native-modal-datetime-picker, react-native-get-random-values, nanoid, expo/vector-icons, react-native-swiper, react-native-screens, use-between

## Installation Instructions
To install and run our application, follow the following steps:
1. Install Node version 14.18.1
2. Install npm version 8.1.1
3. In your console, run 'npm install --global expo-cli'
4. Download our codebase
5. Navigate to the code folder on your local machine and run 'npm install' to install all of the necessary libraries
6. Now, run 'npm start' in the code folder to launch the Expo Metro Bundler
7. Here, you can chose to launch the application in the web, an ios or andriod simulator, or locally on your phone

Running Locally:
- If you would like to run the application locally on your phone:
1. Download the ExpoGo application from the App store
2. Run 'npm start' to navigate to the Expo Metro Bundler
3. On your phone, scan the QR code on the Metro Bundler webpage, and click the link that pops up. This will launch the app in the ExpoGo application. 
