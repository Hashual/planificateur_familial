import { GetUserInfosFromCache } from "@/utils/api/auth/UserInfos";
import React, { useEffect } from "react";
import { Image } from "react-native";
import { View, StyleSheet } from "react-native";

export function MeUserPicture() {
    const [userInfos, setUserInfos] = React.useState(<></>);

    useEffect(() => {
        GetUserInfosFromCache()
            .then((userInfos) => {
                setUserInfos(
                    <>
                        <UserPicture avatarUrl={userInfos.avatarUrl} />
                    </>
                );
            })
            .catch((_e) => {});
    }, []);

    return userInfos;
}

type UserInfosProps = {
    avatarUrl: string | null;
};

export default function UserPicture({ avatarUrl }: UserInfosProps) {
    const defaultAvatar = require("@/assets/images/profil.jpg");

    return (
        <View style={styles.container}>
            <Image
                style={{ width: 100, height: 100, borderRadius: 150 }}
                source={avatarUrl ? { uri: avatarUrl } : defaultAvatar}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        width: "100%",
    },
});
