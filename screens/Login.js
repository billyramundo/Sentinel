import React, { useState } from "react";
import logo from "../assets/logo.png";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";

import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  HStack,
  Center,
  NativeBaseProvider,
  KeyboardAvoidingView,
  useColorMode
} from "native-base"

import { Alert, useColorScheme, Appearance, Platform } from "react-native"

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyCteW-dP7v8bXdmYedGy1_PZTAehNOZbxs",
  authDomain: "test-rules-9cd64.firebaseapp.com",
  databaseURL: "https://test-rules-9cd64-default-rtdb.firebaseio.com",
  projectId: "test-rules-9cd64",
  storageBucket: "test-rules-9cd64.appspot.com",
  messagingSenderId: "598598362177",
  appId: "1:598598362177:web:3c4f4b7aa78111893392c0"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Log out resets stack and moves to Login page
// const logoutAction = StackActions.reset({
//   index: 0,
//   actions: [StackActions.navigate({ routeName: 'Login' })],
// });

let username = "";
let username_stylized = "";
let auth = {};
function Login({ navigation }) {
  var [formData, setData] = useState({});
  var [formErrors, setErrors] = useState({});

  async function validate() {
    formErrors = {};
  
    if (!('email' in formData) || formData.email.length === 0) {
      setErrors({
        ...formErrors,
        email: 'Please enter your email address',
      });
      return false;
    }

    if (!('password' in formData) || formData.password.length === 0) {
      setErrors({
        ...formErrors,
        password: 'Please enter your password',
      });
      return false;
    }

    // Sign in
    auth = await firebase.auth().signInWithEmailAndPassword(formData.email, formData.password).catch(error => {
      if (error.code === 'auth/network-request-failed') {
        setErrors({
          ...formErrors,
          password: 'Could not connect to database. Please try logging in again.',
        });
        return false;
      } else if (error.code === 'auth/invalid-email') {
        setErrors({
          ...formErrors,
          email: 'Invalid email address',
        });
        return false;
      } else if (error.code === 'auth/user-not-found') {
        setErrors({
          ...formErrors,
          email: 'User not found',
        });
        return false;
      } else if (error.code === 'auth/wrong-password') {
        setErrors({
          ...formErrors,
          password: 'Incorrect password. Please try again.',
        });
        return false;
      } else {
        console.error(error.code);
        console.error(error);
        return false;
      }
    });
    if(auth === undefined || auth.user === undefined) {
      return false;
    }

    // Retrieve basic user information for storage in exported variables
    let snapshot = await database.ref(`users/private/${auth.user.uid}`).once("value").catch(error => {
      console.error(error);
      return false;
    });

    username = snapshot.child('username').val()
    username_stylized = snapshot.child('username-stylized').val();

    return true;
  };

  async function onSubmit(){
    let validated = await validate();
    if(!validated) {
      console.log('Login failed');
      return;
    }
    console.log(`User ${username} logged in successfully`);
    
    // Go home AND reset nav stack
    navigation.reset({
      routes: [{ name: 'Home' }]
    });
  };

  // const { colorMode, toggleColorMode } = useColorMode();
  // Appearance.addChangeListener(toggleColorMode);
  // toggleColorMode(colorMode);
  // console.warn(colorMode);

  const moveCreateAccount = () => {
    navigation.navigate("Create Account");
  }

  // set auth persistence
  firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .catch(function(error){
    console.log("failed to set persistence: " + error.message)
  });
  // if user is logged in, go home
  firebase.auth().onAuthStateChanged(async (user) => {
    if (user) {
      // Retrieve basic user information for storage in exported variables
      let snapshot = await database.ref(`users/private/${user.uid}`).once("value").catch(error => {
        console.error(error);
        return false;
      });

      username = snapshot.child('username').val()
      username_stylized = snapshot.child('username-stylized').val();

      navigation.reset({
        routes: [{ name: 'Home' }]
      });
    }
    return true;
  });

  return (    
    <NativeBaseProvider>
      <Center flex={1} px="3">
        <KeyboardAvoidingView
          h="auto"
          w="95%"
          maxW="400"
          justifyContent="flex-end"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={
            Platform.OS !== "web" && Platform.select({
               ios: () => 100,
               android: () => 200
            })()
          }
        >
          <Box safeArea p="2" py="8" w="100%">
            <Center>
              <Heading
                size="xl"
                fontWeight="600"
                color="coolGray.800"
                _dark={{
                  color: "warmGray.50",
                }}
                fontFamily="Avenir"
                fontWeight="black"
              >
                Sentinel
              </Heading>
            </Center>
            <VStack space={3} mt="6">
            <FormControl isInvalid={'email' in formErrors}>
                <FormControl.Label>Email Address</FormControl.Label>
                <Input
                  placeholder="Email"
                  onChangeText={(value) => setData({ ...formData, email: value })}
                />
                <FormControl.ErrorMessage>{formErrors.email}</FormControl.ErrorMessage>
              </FormControl>
              <FormControl isInvalid={'password' in formErrors}>
                <FormControl.Label>Password</FormControl.Label>
                <Input
                  type="password"
                  placeholder="Password"
                  onChangeText={(value) => setData({ ...formData, password: value })}
                />
                <FormControl.ErrorMessage>{formErrors.password}</FormControl.ErrorMessage>
                {/* <Link
                  _text={{
                    fontSize: "xs",
                    fontWeight: "500",
                    color: "indigo.500",
                  }}
                  alignSelf="flex-end"
                  mt="1"
                >
                  Forgot Password?
                </Link> */}
              </FormControl>
              <Center>
                <Button mt="6" colorScheme="lightBlue" onPress={onSubmit} w="60%" maxW="250">
                  Sign In
                </Button>
              </Center>
              <HStack mt="0" justifyContent="center">
                <Text
                  fontSize="sm"
                  color="coolGray.600"
                  _dark={{
                    color: "warmGray.200",
                  }}
                >
                  or {" "}
                </Text>
                <Link
                  _text={{
                    color: "lightBlue.500",
                    fontWeight: "medium",
                    fontSize: "sm",
                  }}
                  onPress={moveCreateAccount}
                  >
                  Create an account
                </Link>
              </HStack>
            </VStack>
          </Box>
        </KeyboardAvoidingView>
      </Center>
    </NativeBaseProvider>
  );
}

export default Login;
export { username };
export { username_stylized };
export { auth };
export { database };
export { firebaseApp };
