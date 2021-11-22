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

var lastRoute = null;

function DoorControl ({ navigation, route }) {
  let door = route.params.door;
  const [lockstateText, setLockStateText] = useState(door.locked ? "Locked!" : "Unlocked!");

  async function changeLockState() {
    door.locked = !door.locked;
    setLockStateText(door.locked ? "Locked!" : "Unlocked!");
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
              {route.params.door.name}
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
