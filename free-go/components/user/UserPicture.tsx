import { GetUserInfosFromCache } from "@/utils/api/auth/UserInfos";
import React, { useEffect } from "react";
import { Image } from "react-native";
import { View, StyleSheet } from "react-native";

export function MeUserPicture() {
    const [userInfos, setUserInfos] = React.useState(<></>)

    useEffect( () => {
        GetUserInfosFromCache().then( (userInfos) => {    
            setUserInfos(<>
                <UserPicture avatarUrl={userInfos.avatarUrl} />
            </>)
        }).catch( (_e) => {} )
    }, [])


    return userInfos;
}

type UserInfosProps = {
    avatarUrl: string,
}

export default function UserPicture({ avatarUrl }: UserInfosProps) {
    return (
        <View style={styles.container}>
            <Image 
                style={{ width: 75, height: 75, borderRadius: 150 }}  
                source={{ uri: avatarUrl }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        padding: 10,
        width: '100%',
        height: '100%',
        flex: 1,
    },
})