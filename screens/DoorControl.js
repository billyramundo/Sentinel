import React, { useState } from "react";
import { styles } from "../Styles";
import SearchField from "react-search-field";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import { firebaseApp, database } from "./Login";
import { useDoorList } from "./Home";
import { sentinelLogo, sentinelTheme } from "./Login";

import {
  Box,
  Heading,
  VStack,
  Button,
  Center,
  NativeBaseProvider,
  Text,
  Icon,
  extendTheme,
  useColorMode
} from "native-base"

import { FontAwesome } from "@expo/vector-icons";

var lastRoute = null;

function DoorControl ({ navigation, route }) {
  const [doorList, setDoorList] = useDoorList();
  let doorCode = route.params.doorCode;

  function changeLockState() {
    const doorData = {...doorList};
    const dataCopy = doorData;
    dataCopy[doorCode].locked = !dataCopy[doorCode].locked;
    setDoorList(dataCopy);
    return false;
    const password = "password";

    if (lockstate_isLocked == true) {
      setLockState(false);
      setLockStateText("unlock");
      var date = getDate();
      const userID = auth.user.uid;
      database.ref('users/' + userID + '/entrances/' + date ).set({
        door: "door id",
        time: getTime()
      });

      axios
        .post("https://p4qcydmk3c.tunnel.kundu.io/command/lock", {
          username: username,
          password: password,
        })
        .then(function (response) {
          console.log(response);
        });
    }
    if (lockstate_isLocked == false) {
      setLockstate(true);
      setLockStateText("lock");
      axios
        .post("https://p4qcydmk3c.tunnel.kundu.io/command/unlock", {
          username: username,
          password: password,
        })
        .then(function (response) {
          console.log(response);
        });
    }
  };

  lastRoute = route;
  return (
    <NativeBaseProvider theme={extendTheme({colors: sentinelTheme})}>
      <Center mt="15%">
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
          {doorList[doorCode].name}
        </Heading>
      </Center>
      <Center mt="30%">
        <Box safeArea w="100%" maxW="400">
          <VStack space={3} mt="6">
            <Center>
              <Button
                mt="10"
                px="10"
                py="10"
                rounded="full"
                style={{aspectRatio: 1}}
                onPress={changeLockState}
                backgroundColor={doorList[doorCode].locked ? "locked.regular" : "unlocked.regular"}
                >
                <Text>
                  <Icon
                    as={FontAwesome}
                    name={doorList[doorCode].locked ? "lock" : "unlock-alt"}
                    color="white"
                    size="3xl"
                  />
                </Text>
              </Button>
            </Center>
          </VStack>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
};

export default DoorControl;
