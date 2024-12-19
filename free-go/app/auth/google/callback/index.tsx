import { router, useLocalSearchParams } from "expo-router";
import WaitingScreen from "@/components/utilities/WaitingScreen";
import { SaveAPIToken } from "@/utils/api/auth/SaveAPIToken";

export default function GoogleSignInCallback() {
	const { token } = useLocalSearchParams<{ token: string }>();
	if (token == "") {
		router.push("/auth/login");
	}

	SaveAPIToken(token);

	return WaitingScreen();
}