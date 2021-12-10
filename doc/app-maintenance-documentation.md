## Install Instructions
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

## Update or Change Key Non-Programming Components
To change database information, one would need to be granted ownership access to our Firebase Sentinel database linked here: https://console.firebase.google.com/u/1/project/sentinel-a6249/overview. We cannot display the actual account information, as the databse is accessed through a team member's Google account, which is why we would grant ownership to new programmmers instead. Then, they would be able to change both the rules and the information stored here. 
The web infrastructure is expandable and allows for, say, switching to another domain instead of tunnel.kundu.io in the future. If these things were changed, which is unlikely, because they are inextricably linked in the source code, it would be by means of an update. The current IP address of the routing server is 143.244.202.43 . Contact 917-696-8150 for any further questions.

## Open Source Tools and Libraries
#### Front end
- axios, 0.23.0, https://github.com/axios/axios/blob/master/LICENSE
- Expo-status-bar, 1.0.4, https://github.com/expo/expo/blob/master/LICENSE
- expo/vector-icons, 1.0.4, https://github.com/expo/expo/blob/master/LICENSE
- React, 16.13.1, https://github.com/facebook/react/blob/main/LICENSE, 
- Native-base, 3.2.2, https://github.com/GeekyAnts/NativeBase/blob/master/LICENSE, 
- React-native, 0.63.2, https://github.com/facebook/react-native/blob/main/LICENSE, 
- React-navigation, 6.0.11, https://github.com/react-navigation/react-navigation/blob/main/packages/drawer/LICENSE, 
- React-native-modal-datetime-picker, 10.2.0, https://github.com/mmazzarolo/react-native-modal-datetime-picker/blob/master/LICENSE.md
- React-native-get-random-values, 1.7.1, https://github.com/LinusU/react-native-get-random-values
- Nanoid, 3.1.30, https://github.com/ai/nanoid/blob/main/LICENSE
- React-native-swiper, 1.6.0, https://github.com/leecade/react-native-swiper/blob/master/LICENSE
- React-native-screens, 3.4.0, https://github.com/software-mansion/react-native-screens/blob/main/LICENSE
- Use-between, 1.0.1, https://github.com/betula/use-between/blob/master/LICENSE



#### Database 
- firebase, 8.2.3, https://opensource.google/projects/firebase-sdk
#### Backend
- pyrebase, 4.5.0, https://libraries.io/pypi/Pyrebase
- Flask, 2.0.2, http://matrix.umcs.lublin.pl/DOC/python-flask-doc/html/license.html#:~:text=Flask%20is%20licensed%20under%20a,and%20the%20disclaimer%20is%20present.
- Localtunnel, 2.0.2, https://github.com/progrium/localtunnel/blob/master/LICENSE

