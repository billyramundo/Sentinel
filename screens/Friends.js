import React, { useState } from "react";
import { styles } from "../Styles";
import {
    View,
    TextInput
} from "react-native";

function Friends({ navigation }) {

    return (
        <View style={styles.back}>
            <View style={styles.middlecontainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Search for friends" />
            </View>
        </View>
    );
}

export default Friends;