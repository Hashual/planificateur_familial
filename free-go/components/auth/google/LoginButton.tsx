import React, { useEffect, useState } from "react";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";
import { createURL, openURL } from "expo-linking";
import { BASE_URL } from "@/hooks/useAPI";

function defaultGoogleButtonSignIn() {
	// TODO: update the api url with the correct one
	fetch(`${BASE_URL}/auth/google/login`).then( (response) => {
		response.json().then( (data) => {
			if (data.code != 200) {
				console.error(data);
				return;
			} else {
				const finalAuthRedirection = createURL("/auth/google/callback");
				const decodedDefaultAuthUrl = decodeURIComponent(data.data.authUrl as string);

				const newUrlRedirection = new URL(decodedDefaultAuthUrl);
				newUrlRedirection.searchParams.set('state', finalAuthRedirection);

				openURL(newUrlRedirection.href);
			}
		}).catch(console.error);
	});
}
export default function GoogleLoginButton() {
	const [googleAuthButton, setGoogleAuthButton] = useState(<></>);

	function setDefaultGoogleButton() {
		setGoogleAuthButton(
				<TouchableOpacity style={styles.button} onPress={defaultGoogleButtonSignIn}>
						<Text style={styles.buttonText}>Se connecter avec Google</Text>
				</TouchableOpacity>
				
				
		);
	}

	useEffect( () => {
		const fn = async () => {
			// TODO: Use the login Button from @react-native-google-signin/google-signin package when it will be debugged for Expo 52.
			setDefaultGoogleButton();
		}
		fn();
	}, []);

	return googleAuthButton;
}
const styles = StyleSheet.create({
	button: {
		width: "100%",
		padding: 15,
		backgroundColor: "#007BFF",
		borderRadius: 8,
		alignItems: "center",
	},
  	buttonText: {
    	color: "#fff",
    	fontWeight: "bold",
  	},

});