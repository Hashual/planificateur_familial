import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { MeUserPicture } from "@/components/user/UserPicture";
import { MeUserName } from "@/components/user/UserName";
import { ThemedText } from "@/components/utilities/ThemedText";
import ContextMenu from "@/components/user/profile/ContextMenu";
import { SearchBar } from "react-native-elements"; // Import de la SearchBar
import Settings from "@/components/user/profile/Settings";

const Profile = () => {
    const [searchQuery, setSearchQuery] = useState(""); // État pour la SearchBar
    return (
        <View style={styles.container}>
            <ThemedText variant="mainTitle">Profile</ThemedText>
            <View style={styles.profile}>
                <MeUserPicture />
                <MeUserName />
            </View>
            <SearchBar
                placeholder="Chercher"
                value={searchQuery} // Gestion de l'état
                onChangeText={setSearchQuery} // Mise à jour de la valeur
                platform="default" // Style natif
                containerStyle={styles.searchBarContainer} // Style optionnel
                inputContainerStyle={styles.searchBarInput} // Style de l'input
            />
            <ContextMenu>
                <Settings/>
            </ContextMenu>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
        flexDirection: "column",
    },
    profile: {
        width: "100%",
        alignItems: "center",
        marginBottom: 10,
    },
    searchBarContainer: {
        paddingVertical: 10,
        width: "85%",
        backgroundColor: "transparent",
        borderTopWidth: 0,
        borderBottomWidth: 0,

    },
    searchBarInput: {
        backgroundColor: "#EFEFEF",
        borderRadius: 10,
    },
});

export default Profile;
