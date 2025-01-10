import React, { useEffect } from "react";
import { ThemedButton, ThemedButtonVisualProps } from "../../utilities/ThemedButton";
import { router } from "expo-router";
import { IsLogin } from "../../../utils/api/auth/IsLogin";
import ClearUserInfos from "@/utils/api/auth/ClearUserInfos";

export default function NavLoginButton(customProps?: ThemedButtonVisualProps) {
	const [button, setButton] = React.useState(<></>)

	function handleLoginButtonClick() {
		router.push('/auth/login');
	}
	
	function handleLoginDisconnectClick() {
		// TODO: Add a confirmation dialog
		ClearUserInfos();
		router.push('/auth/login');
	}

	// TODO: Improve the design?
	useEffect( () => {
		IsLogin().then( (isLogin) => { 
			if (!isLogin) {
				return;
			}
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