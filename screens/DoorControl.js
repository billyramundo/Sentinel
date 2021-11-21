import React, { useState } from "react";
import { styles } from "../Styles";
import SearchField from "react-search-field";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import { firebaseApp, database } from "./Login";

import {
  Box,
  Heading,
  VStack,
  Button,
  Center,
  NativeBaseProvider,
  useColorMode
} from "native-base"

function DoorControl ({ navigation, route }) {
  const [lockstate_isLocked, setLockstate] = useState(false);
  const [lockstateText, setLockStateText] = useState(lockstate_isLocked ? "locked" : "unlocked");

  const changeLockState = () => {
    // Don't do this stuff
    return false;

    const password = "password";

    if (lockstate_isLocked == true) {
      setLockstate(false);
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

  return (
    <NativeBaseProvider>
      <Center flex={1} px="3">
        <Box safeArea p="2" py="8" w="100%" maxW="400">
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
              {route.params.doorCode}
            </Heading>
          </Center>

          <VStack space={3} mt="6">
            <Center>
              <Button mt="6" px="3" py="3" colorScheme="lightBlue" onPress={changeLockState} w="60%" maxW="250">
                {lockstateText}
              </Button>
            </Center>
          </VStack>
        </Box>
      </Center>
    </NativeBaseProvider>
  );
};

export default DoorControl;
