import React, { useState } from "react";
import logo from "../assets/logo.png";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import { sentinelLogo, sentinelTheme, sentinelThemeLight, sentinelThemeDark, username, showToast, closeAllToasts, localeTimeString } from "./Login";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import 'react-native-get-random-values';
import { nanoid } from 'nanoid';

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
  ScrollView,
  Icon,
  extendTheme,
  Toast,
  Spinner
} from "native-base";

import { Alert, useColorScheme, Appearance, Platform } from "react-native"
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ACCESS_TOKEN_LENGTH } from "./Login";

var currentTimeType = 'start';
var currentDay = -1;
const toastNavigateDelay = 1000;

function AccessRule({ navigation, route }) {
  const colorMode = useColorScheme();
  let doorCode = route.params.doorCode;
  let recipientUid = route.params.recipientUid;
  let isNewShare = recipientUid == undefined;
  let recipientIsOwner = 'recipientIsOwner' in route.params ? route.params.recipientIsOwner : false;
  //console.log(cryptoRandomString({length: ACCESS_TOKEN_LENGTH, type: 'base64'}));
  var [accessTimes, setAccessTimes] = useState([{}, {}, {}, {}, {}, {}, {}]);
  const [attemptingSubmit, setAttemptingSubmit] = useState(false);
  const [timePickerDate, setTimePickerDate] = useState(null);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [cancelText, setCancelText] = useState('Cancel');
  const [newRecipientUsernameValid, setNewRecipientUsernameValid] = useState(false);

  var [formErrors, setErrors] = useState({});
  const [recipientUsername, setRecipientUsername] = useState(undefined);

  function updateAccessTime(val) {
    let newAccessTimes = [...accessTimes];
    newAccessTimes[currentDay] = val;
    setAccessTimes(newAccessTimes);
  }
  function showTimePicker(timeType) {
    currentTimeType = timeType;
    setCancelText("Cancel");
    let initialDate = new Date();
    if(currentDay >= 0 && Object.keys(accessTimes[currentDay]).length != 0) {
      initialDate.setHours(accessTimes[currentDay][timeType].substring(0,2));
      initialDate.setMinutes(accessTimes[currentDay][timeType].substring(2,4));
      setCancelText("Remove Access");
    }
    setTimePickerDate(initialDate);
    setTimePickerVisible(true);
  };
  const handleConfirm = (date) => {
    let [hours, minutes] = [String(date.getHours()).padStart(2, '0'), String(date.getMinutes()).padStart(2, '0')];
    let time_HHmm = hours + minutes;
    let start = currentTimeType == 'start' ? time_HHmm : accessTimes[currentDay].start;
    let end = currentTimeType == 'end' ? time_HHmm : accessTimes[currentDay].end;
    if(start != undefined && end != undefined && end < start) {
      showToast("End time cannot be before start time!", "error");
      updateAccessTime({});
      setTimePickerVisible(false);
      return;
    }
    if(currentTimeType == 'start') {
      updateAccessTime({...accessTimes[currentDay], start: time_HHmm});
      if(!('end' in accessTimes[currentDay])) {
        showTimePicker('end');
        return;
      }
      setTimePickerVisible(false);
      return;
    }
    updateAccessTime({...accessTimes[currentDay], end: time_HHmm});
    setTimePickerVisible(false);
  };
  function handleCancel() {
    updateAccessTime({});
    setTimePickerVisible(false);
    return;
  }

  async function revokeAccess(){
    setAttemptingSubmit(true);
    
    try {
      await firebase.database().ref(`/users/access/${recipientUid}/shared/${doorCode}`).remove();
    } catch(error) {
      console.error(error);
      showToast("Failed to unshare door!", "error");
      return false;
    }

    try {
      firebase.database().ref(`/doors/${doorCode}/access/${recipientUid}/time-weekly-whitelist`).remove();
      showToast(`Revoked ${recipientUsername}'s access`, "success");
      setAccessTimes([{}, {}, {}, {}, {}, {}, {}]);
    } catch {
      showToast("ERROR: Failed to revoke access!", "error");
      return false;
    }

    setAttemptingSubmit(false);
  };

  async function validateRecipientUsername() {
    setErrors({});
    let valid = true;

    // Make sure username is not empty
    if(recipientUsername == undefined || recipientUsername.length == 0){
      setErrors({
        recipientUsername: "Please enter a username"
      });
      return false;
    }

    // Make sure username exists in database
    await firebase.database().ref(`/usernames/${recipientUsername}/owner`).once('value', (snapshot) => {
      recipientUid = snapshot.val();
      if(recipientUid === null){
        setErrors({
          recipientUsername: "User not found"
        });
        valid = false;
        return false;
      }
    })
    .catch((error) => {
      console.error(error);
      valid = false;
      return false;
    });
    if(!valid){
      return false;
    }

    // Make sure user is not a door owner
    await firebase.database().ref(`/doors/${doorCode}/owners`).once('value', (snapshot) => {
      if(snapshot.hasChild(recipientUid)){
        setErrors({
          recipientUsername: "User is owner of door"
        });
        valid = false;
        return false;
      }
    })
    .catch((error) => {
      console.error(error);
      valid = false;
      return false;
    });
    if(!valid){
      return false;
    }

    // Make sure user is not already shared with
    await firebase.database().ref(`/doors/${doorCode}/access`).once('value', (snapshot) => {
      if(snapshot.hasChild(recipientUid)){
        setErrors({
          recipientUsername: "User already has access to this door"
        });
        valid = false;
        return false;
      }
    })
    .catch((error) => {
      console.error(error);
      valid = false;
      return false;
    });
    if(!valid){
      return false;
    }

    setNewRecipientUsernameValid(valid);
    return valid;
  }

  async function validate() {
    setAttemptingSubmit(true);
    setErrors({});

    if(isNewShare && !(await validateRecipientUsername())){
      return false;
    }

    if(accessTimes.every(x => x == undefined || Object.keys(x).length == 0)) {
      showToast("Please add at least one access period!", "error");
      return false;
    }

    for (var index = 0; index < accessTimes.length; index++) {
      if(Object.keys(accessTimes[index]).length < 2) {
        try {
          firebase.database().ref(`/doors/${doorCode}/access/${recipientUid}/time-weekly-whitelist/access-data/${index}`).remove();
          continue;
        } catch {
          showToast("Failed to save rules! Please try again.", "error");
          return false;
        }
      }
      let timeStr = String(accessTimes[index].start) + "," + String(accessTimes[index].end);
      try {
        await firebase.database().ref(`/doors/${doorCode}/access/${recipientUid}/time-weekly-whitelist/access-data/${index}`).set(timeStr);
        
        let accessToken = nanoid(ACCESS_TOKEN_LENGTH);
        await firebase.database().ref(`/doors/${doorCode}/access/${recipientUid}/time-weekly-whitelist/access-token`).set(accessToken);
        await firebase.database().ref(`/users/access/${recipientUid}/shared/${doorCode}/access-tokens/time-weekly-whitelist`).set(accessToken);
        accessToken = undefined;
      } catch {
        showToast("Failed to save rules! Please try again.", "error");
        return false;
      }
    }

    try {
      await firebase.database().ref(`/users/access/${recipientUid}/shared/${doorCode}/nickname`).set(`${username}'s Door`);
    } catch(error) {
      console.error(error);
      showToast("Failed to share door!", "error");
      try {
        firebase.database().ref(`/doors/${doorCode}/access/${recipientUid}/time-weekly-whitelist`).remove();
      } catch {
        showToast("CRITICAL ERROR: COULD NOT REVOKE ACCESS AFTER FAILING TO SHARE DOOR", "error");
      }
      return false;
    }

    showToast("Rules saved successfully", "success");
    return true;
  }
  async function onSubmit(){
    let validated = await validate();
    if(!validated) {
      console.log('Rule saving failed');
      setAttemptingSubmit(false);
      return;
    }
    setAttemptingSubmit(false);
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if(recipientUid != undefined) {
        firebase.database().ref(`/users/public/${recipientUid}/username`).once('value', snapshot => {
          setRecipientUsername(snapshot.val());
        });
      }

      let newAccessTimes = [...accessTimes];
      firebase.database().ref(`/doors/${doorCode}/access/${recipientUid}/time-weekly-whitelist/access-data`).once('value', snapshot => {
        snapshot.forEach(function(result) {
          let accessObj = {};
          let index = parseInt(result.key);
          accessObj.start = result.val().substring(0, 4);
          accessObj.end = result.val().substring(5, 9);
          newAccessTimes[index] = accessObj;
        });
      })
      .then(function() {
        setAccessTimes(newAccessTimes);
      });
    });

    return unsubscribe;
  }, [navigation]);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function displayRuleConfig() {
    return accessTimes.map(function(dayAccess, index)
      {
        return (
          <Box key={index} mx="auto" px="4" py="1" w="100%">
            <HStack w="100%">
              <Box w="30%" justifyContent="center">
                <Text fontSize="md" textAlign="left" fontWeight="medium" color={textColor}>{daysOfWeek[index]}</Text>
              </Box>
              <Box w="70%" justifyContent="center" alignItems="flex-end" flexDirection="column">
                <Box justifyContent="center" alignItems="center" flexDirection="row">
                  {
                    Object.keys(dayAccess).length == 0 ?
                    <Button rounded="lg" onPress={() => {currentDay = index; showTimePicker('start');}} backgroundColor={noAccessButtonBgColor}>
                      <Text color={timeButtonTextColor}>No Access</Text>
                    </Button> :
                    <>
                      <Button rounded="lg" onPress={() => {currentDay = index; showTimePicker('start');}} backgroundColor={timeButtonBgColor}>
                      <Text color={timeButtonTextColor}>{localeTimeString(dayAccess.start)}</Text>
                      </Button>
                      <Text mx="2" fontSize="sm" textAlign="right" fontWeight="medium" color={textColor} alignItems="center">to</Text>
                      <Button rounded="lg" onPress={() => {currentDay = index; showTimePicker('end');}} backgroundColor={timeButtonBgColor}>
                        <Text color={timeButtonTextColor}>{localeTimeString(dayAccess.end)}</Text>
                      </Button>
                    </>
                  }
                </Box>
              </Box>
            </HStack>
          </Box>
        )
      }
    )
  }

  let textColor = "white";
  let timeButtonBgColor = "green.700";
  let timeButtonTextColor = "white";
  let noAccessButtonBgColor = "red.900";
  return (    
    <NativeBaseProvider theme={colorMode === 'dark' ? extendTheme(sentinelThemeDark) : extendTheme(sentinelThemeLight)}>
      <SafeAreaView flex={1} edges={['top', 'left', 'right']}>
        <ScrollView mx="auto" w="100%" maxW="800" showsVerticalScrollIndicator={false}>
          <Box mt="10">
            {
              recipientUid != undefined ?
              (<Heading
                size="xl"
                fontWeight="600"
                fontFamily="Avenir"
                fontWeight="bold"
                textAlign="center"
                >
                {recipientUsername + "'s Access"}
              </Heading>) :
              (<Box mx="20%">
                <FormControl isInvalid={'recipientUsername' in formErrors}>
                  <Input
                    size="lg"
                    placeholder="Share with..."
                    onChangeText={(value) => setRecipientUsername(value)}
                    _focus={{borderColor: sentinelTheme.colors.brandPrimary.regular}}
                    _hover={{backgroundColor: "transparent"}}
                    autoCapitalize="none"
                    autoCorrect={false}
                    onEndEditing={validateRecipientUsername}
                    borderColor={newRecipientUsernameValid ? "green.400" : null}
                  />
                  <Center>
                    <FormControl.ErrorMessage>{formErrors.recipientUsername}</FormControl.ErrorMessage>
                  </Center>
                </FormControl>
              </Box>)
            }
          </Box>
          {
            recipientIsOwner ? null :
            (<Box mt="10">
              <Box mx="auto" w="100%" px="4" py="5">
                <Center w="100%">
                  <VStack w="100%" backgroundColor={colorMode === 'dark' ? "gray.900" : "gray.700"} rounded="xl" py="3">
                    {displayRuleConfig()}
                  </VStack>
                </Center>
              </Box>
            </Box>)
          }
          <Button mt="10" w="70%" mx="auto" rounded="lg" onPress={onSubmit} backgroundColor="green.700">
            <HStack display="flex" flexDirection="row" h="7">
              {
                attemptingSubmit ?
                (<Spinner accessibilityLabel="Loading posts" color="white" display="None" />) :
                (<>
                  <Box justifyContent="center">
                    <Text textAlign="right">
                      <Icon
                        as={FontAwesome5}
                        name="save"
                        color="white"
                        size="xs" />
                    </Text>
                  </Box>
                  <Box justifyContent="center">
                    <Text ml="2" fontSize="sm" textAlign="left" fontWeight="medium" color="white">
                      Save Rules
                    </Text>
                  </Box>
                </>)
              }
            </HStack>
          </Button>
          {
            recipientUid == undefined ?
            null :
            <>
            <Center mt="5"><Text color={colorMode === 'dark' ? "gray.200" : "gray.800"}>or</Text></Center>
            <Button mt="5" w="50%" mx="auto" rounded="lg" onPress={revokeAccess} backgroundColor="red.900">
              <HStack display="flex" flexDirection="row" h="7">
                {
                  attemptingSubmit ?
                  (<Spinner accessibilityLabel="Loading posts" color="white" display="None" />) :
                  (<>
                    <Box justifyContent="center">
                      <Text textAlign="right">
                        <Icon
                          as={FontAwesome5}
                          name="minus-circle"
                          color="white"
                          size="xs" />
                      </Text>
                    </Box>
                    <Box justifyContent="center">
                      <Text ml="2" fontSize="sm" textAlign="left" fontWeight="medium" color="white">
                        Revoke Access
                      </Text>
                    </Box>
                  </>)
                }
              </HStack>
            </Button>
            </>
        }
        </ScrollView>
        <DateTimePickerModal
          isVisible={timePickerVisible}
          mode="time"
          date={timePickerDate}
          onConfirm={(date) => {handleConfirm(date, currentTimeType);}}
          onCancel={handleCancel}
          confirmTextIOS={"Set " + currentTimeType.charAt(0).toUpperCase() + currentTimeType.substring(1) + " Time"}
          cancelTextIOS={cancelText}
        />
      </SafeAreaView>
    </NativeBaseProvider>
  );
}

export default AccessRule;
