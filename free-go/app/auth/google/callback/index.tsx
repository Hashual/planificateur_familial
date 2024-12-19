import { router, useLocalSearchParams } from "expo-router";
import WaitingScreen from "@/components/utilities/WaitingScreen";
import { SaveAPIToken } from "@/utils/api/auth/SaveAPIToken";

enum GoogleSignInCallbackError {
	AccountAlreadyExists = "accountAlreadyExists"
}

export default function GoogleSignInCallback() {
	const { token, error } = useLocalSearchParams<{ token?: string, error?: GoogleSignInCallbackError }>();
	if (error) {
		switch (error) {
			case GoogleSignInCallbackError.AccountAlreadyExists:
				// TODO: Change with custom alert
				alert("Un compte avec cette adresse mail existe déjà !");
				break;
		}

		return;
	}	
	
	if (!token || token == "") {
		router.push("/auth/login");
		return;
	}

	SaveAPIToken(token);

	return WaitingScreen();
}