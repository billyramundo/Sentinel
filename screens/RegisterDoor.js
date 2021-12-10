import React, { useState } from "react";
import logo from "../assets/logo.png";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import { sentinelLogo, sentinelTheme, sentinelThemeLight, sentinelThemeDark, ACCESS_TOKEN_LENGTH } from "./Login";
import { FontAwesome5 } from "@expo/vector-icons";
import 'react-native-get-random-values';
import { nanoid } from 'nanoid';
// import TimezoneSelect from "react-timezone-select";

//Page to register a new door when a user recieves it
import {
  Box,
  Text,
  Heading,
  VStack,
  FormControl,
  Input,
  Button,
  HStack,
  Center,
  NativeBaseProvider,
  KeyboardAvoidingView,
  Spinner,
  Icon,
  extendTheme,
  useColorMode
} from "native-base"

import { Alert, useColorScheme, Appearance, Platform } from "react-native"

function RegisterDoor({ navigation }) {
  const colorMode = useColorScheme();
  var [formData, setData] = useState({});
  var [formErrors, setErrors] = useState({});
  const [attemptingSubmit, setAttemptingSubmit] = useState(false);
  const [timezone, setTimezone] = useState(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  //validation for door code
  async function validate() {
    if (!('code' in formData) || formData.code.length === 0) {
      setErrors({ code: 'Code is required' });
      return false;
    } else if (formData.code.length < 10) {
      setErrors({ code: 'Code must be 10 characters' });
      return false;
    }

    if (!('name' in formData) || formData.name.length === 0) {
      setErrors({ name: 'A name is required' });
      return false;
    }

    // if (selectedTimezone == undefined || selectedTimezone.value == undefined || selectedTimezone.value.length == 0) {
    //   setErrors({timeZone: 'A time zone is required'});
    //   return false;
    // }

    let code = formData.code.toLowerCase();
    let uid = firebase.auth().currentUser.uid;

    // Attempt to create door (and set access tokens for owner)
    try {
      let accessToken = nanoid(ACCESS_TOKEN_LENGTH);
      await firebase.database().ref(`/doors/${code}/owners/${uid}/access-token`).set(accessToken);
      await firebase.database().ref(`/users/access/${uid}/owned/${code}/access-token`).set(accessToken);
      console.log("Generated & saved new access token");
      accessToken = undefined;
    } catch (error) {
      console.error(error);
      console.error(error.code);
      if (error.code.toUpperCase() === 'PERMISSION_DENIED') {
        setErrors({ code: 'This door is not eligible for registration.' });
        return false;
      }
      return false;
    }

    // Add nickname for door
    try {
      await firebase.database().ref(`/users/access/${uid}/owned/${code}/nickname`).set(formData.name);
    } catch (error) {
      console.error(error);
      console.error(error.code);
      if (error.code.toUpperCase() === 'PERMISSION_DENIED') {
        setErrors({ code: 'An error occurred setting the nickname for the door!' });
        return false;
      }
    }

    return true;
  };
  //What the user is shown when door is successfully registered
  async function onSubmit() {
    let validated = await validate();
    if (!validated) {
      console.log('Validation Failed');
      setAttemptingSubmit(false);
      return;
    }
    console.log('Information validated & door registered successfully');
    // Go home
    navigation.pop();
  };

  const moveLogin = () => {
    navigation.pop()
  }
  //Display UI
  return (
    <NativeBaseProvider theme={colorMode === 'dark' ? extendTheme(sentinelThemeDark) : extendTheme(sentinelThemeLight)}>
      <Center flex={1} px="3" mt="0">
        <KeyboardAvoidingView
          h="auto"
          w="80%"
          maxW="400"
          justifyContent="flex-end"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={
            Platform.OS !== 'web' ?
              Platform.select({
                ios: () => 100,
                android: () => 200
              })() : 0
          }
        >
          <Box safeArea p="2" py="8" w="100%" maxW="800">
            <Center>
              <HStack>
                <Box justifyContent="center">
                  <Text
                    fontSize={25}
                    fontWeight="600"
                    color="brandPrimary.regular"
                    fontFamily="Avenir"
                    fontWeight="black"
                  >
                    Register Your Door
                  </Text>
                </Box>
                <Box ml="4" justifyContent="center" textAlign="center">
                  <Text>
                    <Icon
                      as={FontAwesome5}
                      name="door-closed"
                      color="brandPrimary.regular"
                      size={7}
                    />
                  </Text>
                </Box>
              </HStack>
            </Center>
            <VStack space={3} mt="8" mb="8">
              <FormControl isRequired isInvalid={'code' in formErrors}>
                <Input
                  placeholder="10-digit code"
                  autoCapitalize="characters"
                  autoCorrect={false}
                  onChangeText={(value) => setData({ ...formData, code: value })}
                  maxLength={10}
                  _focus={{ borderColor: sentinelTheme.colors.brandPrimary.regular }}
                  _hover={{ backgroundColor: "transparent" }}
                />
                <FormControl.HelperText>The 10-character code of the Sentinel Device</FormControl.HelperText>
                <FormControl.ErrorMessage>{formErrors.code}</FormControl.ErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={'name' in formErrors}>
                <Input
                  placeholder="Door name"
                  autoCapitalize="words"
                  onChangeText={(value) => setData({ ...formData, name: value })}
                  _focus={{ borderColor: sentinelTheme.colors.brandPrimary.regular }}
                  _hover={{ backgroundColor: "transparent" }}
                  enablesReturnKeyAutomatically={true}
                  returnKeyType="go"
                  onSubmitEditing={onSubmit}
                />
                <FormControl.HelperText>A name for this door, e.g., "Front Door"</FormControl.HelperText>
                <FormControl.ErrorMessage>{formErrors.name}</FormControl.ErrorMessage>
              </FormControl>
              {/* <FormControl isRequired isInvalid={'timeZone' in formErrors}>
                <TimezoneSelect
                  value={selectedTimezone}
                  onChange={setSelectedTimezone}
                />
                <FormControl.HelperText>The Time Zone in which this door is located</FormControl.HelperText>
                <FormControl.ErrorMessage>{formErrors.timeZone}</FormControl.ErrorMessage>
              </FormControl> */}
              <Center>
                <Button mt="7" w="70%" mx="auto" rounded="lg" onPress={onSubmit} backgroundColor="brandPrimary.regular">
                  <HStack display="flex" flexDirection="row" h="7">
                    {
                      attemptingSubmit ?
                        (<Spinner accessibilityLabel="Registering door..." color="white" display="None" />) :
                        (<>
                          <Box justifyContent="center">
                            <Text textAlign="right">
                              <Icon
                                as={FontAwesome5}
                                name="plus"
                                color="white"
                                size="xs" />
                            </Text>
                          </Box>
                          <Box justifyContent="center">
                            <Text ml="2" fontSize="sm" fontWeight="medium" color="white">
                              Register Door
                        </Text>
                          </Box>
                        </>)
                    }
                  </HStack>
                </Button>
              </Center>
            </VStack>
          </Box>
        </KeyboardAvoidingView>
      </Center>
    </NativeBaseProvider>
  );
}

export default RegisterDoor;
