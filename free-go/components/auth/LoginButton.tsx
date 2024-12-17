import React, { useEffect } from "react";
import { ThemedButton, ThemedButtonVisualProps } from "../utilities/ThemedButton";
import { router } from "expo-router";
import { IsLogin } from "../../utils/api/auth/IsLogin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ClearUserInfos from "@/utils/api/auth/ClearUserInfos";

export default function LoginButton(customProps?: ThemedButtonVisualProps) {
	const [button, setButton] = React.useState(<></>)

	function handleLoginButtonClick() {
		router.push('/auth/login');
	}
	
	function handleLoginDisconnectClick() {
		// TODO: Add a confirmation dialog
		ClearUserInfos();
		router.push('/homePage/OpenDoorPage');
	}

	useEffect( () => {
		IsLogin().then( (isLogin) => {
			setButton(
				<ThemedButton
					title={ isLogin ? 'Déconnexion' : 'Connexion' }
					onPress={ isLogin ? handleLoginDisconnectClick : handleLoginButtonClick }
					type="primary"
					textStyle={{ fontSize: 10 }}
					icon={ isLogin ? 'logout' : 'login' }
					onTop={true}
					{...customProps}
				/>
			)
		})
	}, [])

	return button;
}