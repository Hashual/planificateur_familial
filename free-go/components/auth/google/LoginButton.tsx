import React, { useEffect, useState } from "react";
import { Button } from "react-native";

function defaultGoogleButtonSignIn() {
	// TODO: update the api url with the correct one
	fetch("http://localhost:3000/auth/google/login").then( (response) => {
		response.json().then( (data) => {
			if (data.code != 200) {
				console.error(data);
				return;
			} else {
				const finalAuthRedirection = `${window.location.origin}/auth/google/callback`;
				const decodedDefaultAuthUrl = decodeURIComponent(data.data.authUrl as string);

				const newUrlRedirection = new URL(decodedDefaultAuthUrl);
				newUrlRedirection.searchParams.set('state', finalAuthRedirection);

				window.location.href =  newUrlRedirection.href;
			}
		}).catch(console.error);
	});
}
export default function LoginButton() {
	const [googleAuthButton, setGoogleAuthButton] = useState(<></>);

	function setDefaultGoogleButton() {
		setGoogleAuthButton(
			<>
				<Button
					title="Se connecter avec Google"
					onPress={defaultGoogleButtonSignIn}
				>
				</Button>
			</>
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