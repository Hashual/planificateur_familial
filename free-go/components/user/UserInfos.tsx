import { GetUserInfosFromCache } from "@/utils/api/auth/UserInfos";
import React, { useEffect } from "react";
import { Image, Text } from "react-native";

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
	avatarUrl: string,
	displayName: string
}

export default function UserInfos({ avatarUrl, displayName }: UserInfosProps) {
	return (
		<>
			<Image 
				style={{ width: 50, height: 50 }}
				source={{ uri: avatarUrl }}
			/>
			<Text>{displayName}</Text>
		</>
	)
}