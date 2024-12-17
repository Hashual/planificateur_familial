import React, { useEffect, useState } from "react";
import { Button, Platform } from "react-native";

function defaultGoogleButtonSignIn() {
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

	useEffect( () => {
		const fn = async () => {
			if (Platform.OS != "web" && window.location.hostname != "exp.host") {
				try {
					const dynamicImport = await import("@react-native-google-signin/google-signin");
					setGoogleAuthButton(
						<>
							<dynamicImport.GoogleSigninButton
								size={100}
								color={dynamicImport.GoogleSigninButton.Color.Dark}
								onPress={() => {
									// initiate sign in
								}}
							/>
						</>
					);
				} catch (e) {
					setDefaultGoogleButton();
				}
			} else {
				setDefaultGoogleButton();
			}

			function setDefaultGoogleButton() {
				setGoogleAuthButton(<>
					<Button
						title="Se connecter avec Google"
						onPress={defaultGoogleButtonSignIn}
					>
					</Button>
				</>
				);
			}
		}
		fn();
	}, []);

	return googleAuthButton;
}