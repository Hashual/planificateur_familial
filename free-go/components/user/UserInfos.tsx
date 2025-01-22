import { GetUserInfosFromCache } from "@/utils/api/auth/UserInfos";
import React, { useEffect } from "react";
import { Image, Text } from "react-native";
import { View, StyleSheet } from "react-native";
import { ThemedText } from "../utilities/ThemedText";

export function MeUserInfos() {
	const [userInfos, setUserInfos] = React.useState(<></>)

	useEffect( () => {
		GetUserInfosFromCache().then( (userInfos) => {
			const displayName = `${userInfos.firstName} ${userInfos.lastName}`
	
			setUserInfos(<>
				<UserInfos avatarUrl={userInfos.avatarUrl} displayName={displayName} />
			</>)
		}).catch( (_e) => {} )
	}, [])


	return userInfos;
}

type UserInfosProps = {
	avatarUrl: string | null,
	displayName: string
}

export default function UserInfos({ avatarUrl, displayName }: UserInfosProps) {
	const defaultAvatar = require("@/assets/images/profil.jpg");

	return (

		<View style={styles.container}>
			<Image 
				style={{ width: 50, height: 50 }}
                source={avatarUrl ? { uri: avatarUrl } : defaultAvatar}
			/>
			<View style={styles.text}>
				<ThemedText>{displayName}</ThemedText>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		paddingBottom: 5,
		paddingHorizontal: 5,
		flexDirection: 'row',
		width: '100%',
		height: '100%',
		flex: 1,
	},
	text:{
		width: '100%',
		height: '100%',
		marginLeft: 10,
	}
})