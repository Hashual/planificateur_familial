import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { MeUserPicture } from "@/components/user/UserPicture";
import { MeUserName } from "@/components/user/UserName";
import { ThemedText } from "@/components/utilities/ThemedText";
import ContextMenu from "@/components/user/profile/ContextMenu";
import { SearchBar } from "react-native-elements"; // Import de la SearchBar
import Settings from "@/components/user/profile/Settings";
import BackArrow from "@/components/BackArrow";

const Profile = () => {
    const [searchQuery, setSearchQuery] = useState(""); // État pour la SearchBar
    return (
        <View style={{backgroundColor: "#F5FCFF", height: "100%"}}>
            <View style={{flexDirection: "row", width:"100%", position:"relative"}}>
                <BackArrow/>
                <ThemedText variant="title" style={{position: "absolute", width:"100%",pointerEvents:"none", textAlign:"center"}}>Profil</ThemedText>
            </View>
            <View style={styles.container}>
                <View style={styles.profile}>
                    <MeUserPicture />
                    <MeUserName />
                </View>
                <SearchBar
                    placeholder="Chercher"
                    value={searchQuery} // Gestion de l'état
                    onChangeText={(setSearchQuery)} // Mise à jour de la valeur
                    platform="default" // Style natif
                    containerStyle={styles.searchBarContainer} // Style optionnel
                    inputContainerStyle={styles.searchBarInput} // Style de l'input
                />
                <ContextMenu>
                    <Settings/>
                </ContextMenu>
            </View>
        </View>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: "100%",
        height: "100%",
        alignItems: "center",
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
