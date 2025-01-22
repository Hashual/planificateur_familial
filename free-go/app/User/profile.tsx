import { MeUserPicture } from "@/components/user/UserPicture";
import { MeUserName } from "@/components/user/UserName";
import { ThemedText } from "@/components/utilities/ThemedText";
import React from "react";
import { StyleSheet,View } from "react-native";

const Profile = () => {
    return (
        <View style={styles.container}>
            <ThemedText variant="mainTitle">Profile</ThemedText>
            <View style={styles.profile}>
                <MeUserPicture/>
                <MeUserName/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container :{
        flex: 1,
        width: '100%',
        height: '100%',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        flexDirection: 'column',
    },
    profile: {
        width: '100%',
        alignItems: 'center',
    },
});

export default Profile;