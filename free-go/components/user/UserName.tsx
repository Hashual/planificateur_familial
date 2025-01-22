import { GetUserInfosFromCache } from "@/utils/api/auth/UserInfos";
import React, { useEffect } from "react";
import { Image, Text } from "react-native";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "../utilities/ThemedText";

export function MeUserName() {
    const [userInfos, setUserInfos] = React.useState(<></>)

    useEffect( () => {
        GetUserInfosFromCache().then( (userInfos) => {
            const displayName = `${userInfos.firstName} ${userInfos.lastName}`
    
            setUserInfos(<>
                <UserInfos displayName={displayName} />
            </>)
        }).catch( (_e) => {} )
    }, [])


    return userInfos;
}

type UserInfosProps = {
    displayName: string
}

export default function UserInfos({ displayName }: UserInfosProps) {
    return (
        <View style={styles.text}>
            <ThemedText variant="subtitle">{displayName}</ThemedText>
        </View>
    )
}

const styles = StyleSheet.create({
    text:{
        flex: 1,
        width: '100%',
        height: '5%',
        alignItems: 'center',
    }
})