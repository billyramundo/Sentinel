import React, { useState } from "react";
import { styles } from "../Styles";
import SearchField from "react-search-field";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import { firebaseApp, database, localeTimeString } from "./Login";
import { useDoorList } from "./Home";
import { sentinelTheme, sentinelThemeLight, sentinelThemeDark } from "./Login";
import { useColorScheme } from "react-native";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import Swiper from "react-native-swiper";

import {
  View,
  Box,
  Heading,
  VStack,
  Button,
  Center,
  NativeBaseProvider,
  Text,
  HStack,
  Icon,
  extendTheme,
  ScrollView,
  Divider
} from "native-base"

function DoorControl ({ navigation, route }) {
  const colorMode = useColorScheme();
  const [doorList, setDoorList] = useDoorList();
  const [sharingData, setSharingData] = useState({});
  const [recipientUsernames, setRecipientUsernames] = useState({});
  const [swiperRenderReady, setSwiperRenderReady] = useState(false);
  let doorCode = route.params.doorCode;

  let bgColor = sentinelTheme.colors[doorList[doorCode].locked ? "locked" : "unlocked"]["background"][colorMode]
  let fgColor = sentinelTheme.colors[doorList[doorCode].locked ? "locked" : "unlocked"][colorMode === 'dark' ? 'regular' : 'dark']
  let textColor = bgColor;

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

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSwiperRenderReady(false);
      const newSharingData = {};
      database.ref(`/doors/${doorCode}/access`).once('value', snapshot => {
        snapshot.forEach(function(result) {
          let recipientUid = result.key;
          newSharingData[recipientUid] = Array.from({...result.child('time-weekly-whitelist').val(), length:7});
        });
      })
      .then(async function() {
        setSharingData(newSharingData);
        
        let newRecipientUsernames = {};
        for (const uid of Object.keys(newSharingData)) {
          await firebase.database().ref(`/users/public/${uid}/username`).once('value', snapshot => {
            newRecipientUsernames[uid] = snapshot.val();
          });
        }
        setRecipientUsernames(newRecipientUsernames);
        setSwiperRenderReady(true);
      });
    });

    return unsubscribe;
  }, [navigation]);

  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  function displayWeeklyAccess(uid){
    let accessTimes = uid in sharingData ? sharingData[uid] : Array(7).fill(undefined);
    return (
      <>
      <Box>
        <Text
          color={textColor}
          fontWeight="bold"
          fontSize="lg"
          mx="auto"
          >
          {uid in recipientUsernames ? recipientUsernames[uid] : "Loading..."}
        </Text>
      </Box>
      <Divider bg={textColor} h="2px" mt="3" mb="3"></Divider>
      <Box mt="1">
        {
          daysOfWeek.map((day, index) => {
            let timeStr = "Loading...";
            if(Object.keys(sharingData).length > 0)
            {
              timeStr = accessTimes[index] == undefined ? "No Access" : localeTimeString(accessTimes[index].substring(0, 4)) + " - " + localeTimeString(accessTimes[index].substring(5, 9));
            }
            return (
            <HStack key={day}>
              <Text color={textColor} fontSize="sm" w="35%" fontWeight="medium">{day}</Text>
              <Text color={textColor} fontSize="sm" w="65%" textAlign="right">{timeStr}</Text>
            </HStack>
            );
          })
        }
      </Box>
      </>
    );
  }

  function addAccessCard() {
    return (
    <Box
      key="addAccess"
      margin="auto"
      px="2"
      h="200px"
      w="80%">
      <Box
        rounded="xl"
        margin="auto"
        px="4"
        pt="4"
        pb="5"
        w="100%"
        backgroundColor={fgColor}
        >
        <Box>
          <Text
            color={textColor}
            fontWeight="bold"
            fontSize="lg"
            mx="auto"
            >
            Share This Door
          </Text>
        </Box>
        <Box mt="3">
          <Center>
            <Button
            rounded="lg"
            onPress={() => {navigation.navigate("Door Sharing", {doorCode: doorCode});}}
            backgroundColor={bgColor}
            >
              <HStack>
                <Box justifyContent="center">
                  <Text>
                    <Icon
                      as={FontAwesome5}
                      name="user-plus"
                      color={fgColor}
                      size="xs"
                    />
                  </Text>
                </Box>
                <Box justifyContent="center">
                  <Text ml="2" fontSize="sm" textAlign="left" fontWeight="medium" color={fgColor}>
                    Add Access Rule
                  </Text>
                </Box>
              </HStack>
            </Button>
          </Center>
        </Box>
      </Box>
    </Box>
    )
  }
  function getSharingCards() {
    return Object.keys(sharingData).map((recipientUid) => {
      return (
        <Box 
          key={recipientUid}
          margin="auto"
          px="2"
          h="200px"
          w="80%"
          >
          <Box
            rounded="xl"
            margin="auto"
            px="4"
            pt="4"
            pb="5"
            w="100%"
            backgroundColor={fgColor}
            >
            {displayWeeklyAccess(recipientUid)}
            <Box mt="5">
              <Center>
                <Button
                rounded="lg"
                onPress={() => {navigation.navigate("Door Sharing", {doorCode: doorCode, recipientUid: recipientUid});}}
                backgroundColor={bgColor}
                >
                  <HStack>
                    <Box justifyContent="center">
                      <Text>
                        <Icon
                          as={FontAwesome5}
                          name="pen"
                          color={fgColor}
                          size="xs"
                        />
                      </Text>
                    </Box>
                    <Box justifyContent="center">
                      <Text ml="2" fontSize="sm" textAlign="left" fontWeight="medium" color={fgColor}>
                        Change
                      </Text>
                    </Box>
                  </HStack>
                </Button>
              </Center>
            </Box>
          </Box>
        </Box>
      )
    });
  }

  function renderSwiper() {
    return (
      <Box height="300px" w="100%">
        <Swiper
        showsButtons={true}
        loop={false}
        w="100%"
        dotStyle={{display: 'none'}}
        activeDotStyle={{display: 'none'}}
        prevButton={(<Text style={{color: fgColor}} fontSize="5xl">‹</Text>)}
        nextButton={(<Text style={{color: fgColor}} fontSize="5xl">›</Text>)}
        >
          {[...getSharingCards(), addAccessCard()].map((el) => el)}
        </Swiper>
      </Box>
    )
  }

  return (
    <NativeBaseProvider theme={colorMode === 'dark' ? extendTheme(sentinelThemeDark) : extendTheme(sentinelThemeLight)}>
      <View w="100%" h="100%" backgroundColor={bgColor}>
        <SafeAreaView flex={1} edges={['top', 'left', 'right']}>
          <ScrollView
            w="100%"
            h="100%"
            px="1"
            maxW="600"
            mx="auto"
            showsVerticalScrollIndicator={false}
            flex={1} flexDirection="column"
            >
            <Box safeArea w="100%">
              <Center>
                <Heading
                  mt="10"
                  size="xl"
                  fontFamily="Avenir"
                  fontWeight="black"
                  color={fgColor}
                  textAlign="center"
                  >
                  {doorList[doorCode].name}
                </Heading>
                <Box safeArea w="100%" maxW="400">
                  <Center>
                    <Button
                      px="0"
                      py="0"
                      w={150}
                      h={150}
                      rounded="full"
                      onPress={changeLockState}
                      backgroundColor="transparent"
                      >
                      <Text>
                        <Icon
                          as={FontAwesome}
                          name={doorList[doorCode].locked ? "lock" : "unlock-alt"}
                          color={fgColor}
                          size={40}
                        />
                      </Text>
                    </Button>
                  </Center>
                </Box>
              </Center>
            </Box>
            {swiperRenderReady ? renderSwiper() : null}
          </ScrollView>
        </SafeAreaView>
      </View>
    </NativeBaseProvider>
  );
};

export default DoorControl;
