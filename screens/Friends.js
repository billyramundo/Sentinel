import React, { useState } from "react";
import { styles } from "../Styles";
import SearchField from "react-search-field";
import firebase from "firebase/app";
import "firebase/database";
import "firebase/auth";
import "firebase-admin";
import { database } from "../screens/Login";
import {
    View,
    TextInput,
    Text,
} from "react-native";

function Friends({ navigation }) {
    const [email, setEmail] = useState("");
    const [displayEmail, setDisplayEmail] = useState("");
    const getUser = () => {
        firebase
            .auth()
            .getUserByEmail(email)
            .then((userRecord) => {
                setDisplayEmail(userRecord.getEmail());
                console.log("Successfully found user");
            })
            .catch((error) => {
                console.log("User does not exist")
            });
    };
    return (
        <View style={styles.back}>
            <View style={styles.centeredcontainer}>
                <SearchField
                    placeholder="Search for friends"
                    onChange={(email) => setEmail(email)}
                    onSearchClick={getUser} />
            </View>
            <View style={styles.middlecontainer}>
                <Text>{displayEmail}</Text>
            </View>
            <View style={styles.middlecontainer}></View>
            <View style={styles.middlecontainer}></View>
        </View>
    );
}

export default Friends;