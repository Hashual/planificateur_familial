import { router, useLocalSearchParams } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import WaitingScreen from "@/components/utilities/WaitingScreen";
import { GetUserInfos } from "@/utils/api/GetUserInfos";

export default function GoogleSignInCallback() {
	const { token } = useLocalSearchParams<{ token: string }>();
	if (token == "") {
		router.push("/auth/login");
	}

	AsyncStorage.setItem("session-token", token);
	GetUserInfos().then( (user) => {
		AsyncStorage.setItem("user-infos", JSON.stringify(user));
		router.push("/homePage/OpenDoorPage");

	}).catch( (error) => {
		console.error(error);
		router.push("/auth/login");
	})

	return WaitingScreen();
}