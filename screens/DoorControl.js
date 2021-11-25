import React, { useState } from "react";
import { styles } from "../Styles";
import SearchField from "react-search-field";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import { firebaseApp, database } from "./Login";
import { useDoorList } from "./Home";
import { sentinelTheme, sentinelThemeLight, sentinelThemeDark } from "./Login";
import { useColorScheme } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  View,
  Box,
  Heading,
  VStack,
  Button,
  Center,
  NativeBaseProvider,
  Text,
  Icon,
  extendTheme,
  ScrollView,
  useColorMode
} from "native-base"

var lastRoute = null;

function DoorControl ({ navigation, route }) {
  const colorMode = useColorScheme();
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
    <NativeBaseProvider theme={colorMode === 'dark' ? extendTheme(sentinelThemeDark) : extendTheme(sentinelThemeLight)}>
      <View w="100%" h="100%" backgroundColor={(doorList[doorCode].locked ? "locked" : "unlocked") + ".background." + colorMode}>
        <SafeAreaView flex={1} edges={['top', 'left', 'right']}>
          <ScrollView
            w="100%"
            h="100%"
            backgroundColor={(doorList[doorCode].locked ? "locked" : "unlocked") + ".background." + colorMode}
            showsVerticalScrollIndicator={false}
            >
            <VStack>
              <Center>
                <Heading
                  mt="30%"
                  size="xl"
                  fontWeight="600"
                  fontFamily="Avenir"
                  fontWeight="black"
                  color={(doorList[doorCode].locked ? "locked" : "unlocked") + "." + (colorMode === 'dark' ? 'regular' : 'dark')}
                  >
                  {doorList[doorCode].name}
                </Heading>
                <Box safeArea w="100%" maxW="400" mt="10">
                  <Center>
                    <Button
                      px="0"
                      py="0"
                      w={200}
                      h={200}
                      rounded="full"
                      onPress={changeLockState}
                      backgroundColor="transparent"
                      >
                      <Text>
                        <Icon
                          as={FontAwesome}
                          name={doorList[doorCode].locked ? "lock" : "unlock-alt"}
                          color={(doorList[doorCode].locked ? "locked" : "unlocked") + "." + (colorMode === 'dark' ? 'regular' : 'dark')}
                          size={40}
                        />
                      </Text>
                    </Button>
                  </Center>
                </Box>
              </Center>
            </VStack>
          </ScrollView>
        </SafeAreaView>
      </View>
    </NativeBaseProvider>
  );
};

export default DoorControl;
