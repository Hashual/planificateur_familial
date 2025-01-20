import { MeUserPicture } from "@/components/user/UserPicture";
import { MeUserName } from "@/components/user/UserName";
import { ThemedText } from "@/components/utilities/ThemedText";
import React from "react";
import { StyleSheet,View } from "react-native";

const Profile = () => {
    return (
        <View style={styles.container}>
            <ThemedText variant="mainTitle">Profile</ThemedText>
            <MeUserPicture/>
            <MeUserName/>
        </View>
    );
}

const styles = StyleSheet.create({
    container :{
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        flexDirection: 'column',
    }
});

export default Profile;