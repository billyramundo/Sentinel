import React, { useState } from "react";
import logo from "../assets/logo.png";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import { FontAwesome5 } from "@expo/vector-icons";

import {
  Box,
  Text,
  VStack,
  FormControl,
  Input,
  Link,
  Button,
  HStack,
  Center,
  NativeBaseProvider,
  KeyboardAvoidingView,
  Icon,
  Toast,
  extendTheme,
  Spinner
} from "native-base";

import { useColorScheme, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const sentinelTheme = {
  colors: {
    brandPrimary: {
      regular: '#0d98d9',
      light: '#38bdf8',
      dark: '#0369a1',
    },
    brandSecondary: {
      regular: '#14b8a6',
      light: '#5eead4',
      dark: '#0f766e'
    },
    locked: {
      regular: '#f98585',
      light: '#fca5a5',
      dark: '#991b1b',
      background: {
        light: '#f98585',
        dark: '#821717'
      }
    },
    unlocked: {
      regular: '#53df86',
      light: '#86efac',
      dark: '#166534',
      background: {
        light: '#4ade80',
        dark: '#166534'
      }
    },
    grayLabelText: {
      light: 'muted.700',
      dark: 'muted.400'
    }
  },
};

const sentinelThemeLight = {
  colors: {
    ...sentinelTheme.colors
  },
  components: {
    Input: {
      baseStyle: {
        borderColor: "gray.300",
        color: "gray.800"
      }
    }
  }
}

const sentinelThemeDark = {
  colors: {
    ...sentinelTheme.colors
  },
  components: {
    Input: {
      baseStyle: {
        borderColor: "gray.700",
        color: "gray.200",
        backgroundColor: "transparent"
      }
    },
    Heading: {
      baseStyle: {
        color: "gray.200"
      }
    }
  }
}

function sentinelLogo(color="brandPrimary.regular") {
  return (
  <HStack>
    <Box justifyContent="center">
      <Text
        fontSize={50}
        fontWeight="600"
        color={color}
        fontFamily="Avenir"
        fontWeight="black"
        mt="1"
        >
        Sentinel
      </Text>
    </Box>
    <Box ml="4" justifyContent="center" textAlign="center">
      <Text>
        <Icon
          as={FontAwesome5}
          name="user-shield"
          color={color}
          size={10}
        />
      </Text>
    </Box>
  </HStack>
  )
}

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

const ACCESS_TOKEN_LENGTH = 20;

let username = "";
let username_stylized = "";
let auth = {};

async function showToast(text, type, duration=5000) {
  let toastBgColor = "#444";
  if(type == 'success') {
    toastBgColor = "#050";
  }
  else if(type == 'error') {
    toastBgColor = "#500";
  }
  Toast.show({description: text, placement: "bottom", style: {backgroundColor: toastBgColor}, duration: duration});
}
async function closeAllToasts() {
  Toast.closeAll();
}

const localeTimeString = (time_HHmm) => {
  if(time_HHmm == undefined) {
    return "...";
  }
  var dummyDate = new Date();
  dummyDate.setHours(time_HHmm.substring(0, 2));
  dummyDate.setMinutes(time_HHmm.substring(2, 4));
  let localeTimeString = dummyDate.toLocaleTimeString().trim();
  // Remove seconds if present
  if((localeTimeString.match(/:/g)||[]).length == 2){
    localeTimeString = localeTimeString.replace(/:\d\d(?: |$)/, ' ').trim();
  }
  return localeTimeString;
}

function Login({ navigation }) {
  const colorMode = useColorScheme();
  var [formData, setData] = useState({});
  var [formErrors, setErrors] = useState({});
  const [attemptingSubmit, setAttemptingSubmit] = useState(false);
  
  async function validate() {
    setErrors({});
  
    let shouldReturnFalse = false;
    if (!('email' in formData) || formData.email.length === 0) {
      setErrors({
        email: 'Please enter your email address',
      });
      return false;
    }

    if (!('password' in formData) || formData.password.length === 0) {
      setErrors({
        password: 'Please enter your password',
      });
      return false;
    }

    // Sign in
    setAttemptingSubmit(true);
    auth = await firebase.auth().signInWithEmailAndPassword(formData.email, formData.password).catch(error => {
      if (error.code === 'auth/network-request-failed') {
        setErrors({
          password: 'Could not connect to database. Please try logging in again.',
        });
        shouldReturnFalse = true;
        return false;
      } else if (error.code === 'auth/invalid-email') {
        setErrors({
          email: 'Invalid email address',
        });
        shouldReturnFalse = true;
        return false;
      } else if (error.code === 'auth/user-not-found') {
        setErrors({
          email: 'User not found',
        });
        shouldReturnFalse = true;
        return false;
      } else if (error.code === 'auth/wrong-password') {
        setErrors({
          password: 'Incorrect password. Please try again.',
        });
        shouldReturnFalse = true;
        return false;
      } else {
        console.error(error.code);
        console.error(error);
        shouldReturnFalse = true;
        return false;
      }
    });
    if(shouldReturnFalse || auth === undefined || auth.user === undefined) {
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
      setAttemptingSubmit(false);
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
    <NativeBaseProvider theme={colorMode === 'dark' ? extendTheme(sentinelThemeDark) : extendTheme(sentinelThemeLight)}>
      <SafeAreaView flex={1} edges={['top', 'left', 'right']}>
        <KeyboardAvoidingView
          h="auto"
          w="100%"
          maxW="400"
          mx="auto"
          justifyContent="flex-end"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={
            Platform.OS !== "web" && Platform.select({
                ios: () => 0,
                android: () => 0
            })()
          }
          >
          <Box safeArea px="3" py="8" w="90%" mx="auto" h="100%" justifyContent="center">
            <Center>
              {sentinelLogo()}
            </Center>
            <VStack space={3} mt="6">
              <FormControl isInvalid={'email' in formErrors}>
                <FormControl.Label _text={{color: sentinelTheme.colors.grayLabelText[colorMode]}}>Email Address</FormControl.Label>
                <Input
                  size="md"
                  placeholder="Email"
                  onChangeText={(value) => setData({ ...formData, email: value })}
                  _focus={{borderColor: sentinelTheme.colors.brandPrimary.regular}}
                  _hover={{backgroundColor: "transparent"}}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                <FormControl.ErrorMessage>{formErrors.email}</FormControl.ErrorMessage>
              </FormControl>
              <FormControl isInvalid={'password' in formErrors}>
                <FormControl.Label _text={{color: sentinelTheme.colors.grayLabelText[colorMode]}}>Password</FormControl.Label>
                <Input
                  size="md"
                  type="password"
                  placeholder="Password"
                  onChangeText={(value) => setData({ ...formData, password: value })}
                  _focus={{borderColor: sentinelTheme.colors.brandPrimary.regular}}
                  _hover={{backgroundColor: "transparent"}}
                  enablesReturnKeyAutomatically={true}
                  autoCapitalize="none"
                  returnKeyType="go"
                  onSubmitEditing={onSubmit}
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
            </VStack>
          <Button mt="10" w="70%" mx="auto" rounded="lg" onPress={onSubmit} backgroundColor="brandPrimary.regular">
            <HStack display="flex" flexDirection="row" h="7">
              {
                attemptingSubmit ?
                (<Spinner accessibilityLabel="Signing in..." color="white" display="None" />) :
                (<>
                  <Box justifyContent="center">
                    <Text textAlign="right">
                      <Icon
                        as={FontAwesome5}
                        name="sign-in-alt"
                        color="white"
                        size="xs" />
                    </Text>
                  </Box>
                  <Box justifyContent="center">
                    <Text ml="2" fontSize="sm" textAlign="left" fontWeight="medium" color="white">
                      Sign In
                    </Text>
                  </Box>
                </>)
              }
            </HStack>
          </Button>
          <HStack mt="2" justifyContent="center">
            <Text
              fontSize="sm"
              color="coolGray.600"
              _dark={{
                color: "warmGray.200",
              }}
            >
              or{" "}
            </Text>
            <Link
              _text={{
                color: "brandPrimary.regular",
                fontWeight: "medium",
                fontSize: "sm",
              }}
              onPress={moveCreateAccount}
              >
              Create an account
            </Link>
          </HStack>
          </Box>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </NativeBaseProvider>
  );
}

export default Login;
export { username };
export { username_stylized };
export { auth };
export { database };
export { firebaseApp };
export { sentinelLogo };
export { sentinelTheme };
export { sentinelThemeLight };
export { sentinelThemeDark };
export { showToast, closeAllToasts };
export { localeTimeString };
export { ACCESS_TOKEN_LENGTH };