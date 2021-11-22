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

function CreateAccount({ navigation }) {
  
  var [formData, setData] = useState({});
  var [formErrors, setErrors] = useState({});

  async function validate() {
    formErrors = {};
  
    let username_stylized = 'username' in formData ? formData.username : undefined;
    let username_lower = 'username' in formData ? formData.username.toLowerCase() : undefined;
  
    if (!('name' in formData) || formData.name.length === 0) {
      setErrors({
        ...formErrors,
        email: 'Name is required',
      });
      return false;
    }

    if (!('username' in formData) || username_lower.length === 0) {
      setErrors({
        ...formErrors,
        username: 'Username is required',
      });
      return false;
    } else if (username_lower.length < 3) {
      setErrors({
        ...formErrors,
        username: 'Username is too short',
      });
      return false;
    } else if (username_lower !== undefined){
      let snapshot = await firebase.database().ref(`usernames/${username_lower}`).once("value").catch(error => {
        console.error(error);
      });
      if(snapshot.exists()) {
        setErrors({
          ...formErrors,
          username: 'Username is already taken',
        });
        return false;
      }
    }

    if (!('email' in formData) || formData.email.length === 0) {
      setErrors({
        ...formErrors,
        email: 'Email address is required',
      });
      return false;
    }

    if (!('password' in formData) || formData.password.length === 0) {
      setErrors({
        ...formErrors,
        password: 'Password is required',
      });
      return false;
    } else if (formData.password.length < 6) {
      setErrors({
        ...formErrors,
        password: 'Password is too short',
      });
      return false;
    }
  
    // Attempt to create user
    let auth = await firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password).catch(error => {
      if (error.code === 'auth/email-already-in-use') {
        setErrors({
          ...formErrors,
          email: 'Email address already in use',
        });
        return false;
      }
      if (error.code === 'auth/invalid-email') {
        setErrors({
          ...formErrors,
          email: 'Email address invalid',
        });
        return false;
      }
      console.error(error.code);
      console.error(error);
  
      // Do not validate
      return false;
    });

    if(auth === undefined || auth === false) {
      console.error("Encountered unhandled error when creating new user.");
      return false;
    }
    
    console.log('User account created & signed in!');

    // Put user's display name in Firebase auth
    await auth.user.updateProfile({displayName: formData.name}).catch((error) => {
      console.error(error);
    });

    // Add user to private
    firebase.database().ref(`users/private/${auth.user.uid}`).set({
      "username": username_lower,
      "username-stylized": formData.username
    });
    // Point user's uid in public to user's username
    firebase.database().ref(`users/public/${auth.user.uid}`).set({
      "username": username_lower,
      "username-stylized": formData.username
    });
    // Point username to user; store stylized version, too
    firebase.database().ref(`usernames/${username_lower}`).set({
      "owner": auth.user.uid
    });
    // Add user as owner of door
    // firebase.database().ref(`doors/${door_id}/owners` + auth.user.uid).update({
    //   username: true,
    // });
  
    return true;
  };

  async function onSubmit(){
    let validated = await validate();
    if(!validated) {
      console.log('Validation Failed');
      return;
    }
    console.log('Information validated & user created successfully');
    // Go home AND reset nav stack
    navigation.reset({
      routes: [{ name: 'Home' }]
    });
  };

  const moveLogin = () => {
    navigation.pop()
  }

  const { colorMode, toggleColorMode } = useColorMode();
  Appearance.addChangeListener(toggleColorMode, colorMode);
  toggleColorMode(colorMode);

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
            Platform.select({
               ios: () => 70,
               android: () => 200
            })()
          }
        >
          <Box safeArea p="2" py="8" w="95%" maxW="400">
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
            <FormControl isRequired isInvalid={'name' in formErrors}>
                <FormControl.Label>Name</FormControl.Label>
                <Input
                  placeholder="Name"
                  onChangeText={(value) => setData({ ...formData, name: value })}
                />
                <FormControl.ErrorMessage>{formErrors.name}</FormControl.ErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={'username' in formErrors}>
                <FormControl.Label>Username</FormControl.Label>
                <Input
                  placeholder="Username"
                  onChangeText={(value) => setData({ ...formData, username: value })}
                />
                <FormControl.HelperText>Username must contain at least 3 characters.</FormControl.HelperText>
                <FormControl.ErrorMessage>{formErrors.username}</FormControl.ErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={'email' in formErrors}>
                <FormControl.Label>Email Address</FormControl.Label>
                <Input
                  placeholder="Email"
                  onChangeText={(value) => setData({ ...formData, email: value })}
                />
                <FormControl.ErrorMessage>{formErrors.email}</FormControl.ErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={'password' in formErrors}>
                <FormControl.Label>Password</FormControl.Label>
                <Input
                  type="password"
                  placeholder="Password"
                  onChangeText={(value) => setData({ ...formData, password: value })}
                />
                <FormControl.HelperText>Password must contain at least 6 characters.</FormControl.HelperText>
                <FormControl.ErrorMessage>{formErrors.password}</FormControl.ErrorMessage>
              </FormControl>
              <Center>
                <Button mt="6" colorScheme="lightBlue" onPress={onSubmit} w="60%" maxW="250">
                  Create Account
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
                  Already registered?{" "}
                <Link
                  _text={{
                    color: "lightBlue.500",
                    fontWeight: "medium",
                    fontSize: "sm",
                  }}
                  onPress={moveLogin}
                  >
                  Sign in
                </Link>
                </Text>
              </HStack>
            </VStack>
          </Box>
        </KeyboardAvoidingView>
      </Center>
    </NativeBaseProvider>
  );
}

export default CreateAccount;
