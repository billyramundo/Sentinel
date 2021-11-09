import React, { useState } from "react";
import { styles } from "../Styles";
import SearchField from "react-search-field";
import {
    View,
    TextInput,
} from "react-native";

function Friends({ navigation }) {

    return (
        <View style={styles.back}>
            <View style={styles.centeredcontainer}>
                <SearchField
                    placeholder="Search for friends" />
            </View>
            <View style={styles.middlecontainer}></View>
            <View style={styles.middlecontainer}></View>
            <View style={styles.middlecontainer}></View>
        </View>
    );
}

export default Friends;