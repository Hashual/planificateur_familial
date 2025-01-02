import AsyncStorage from "@react-native-async-storage/async-storage";
import { GetUserInfos } from "./UserInfos";
import { router } from "expo-router";

export function SaveAPIToken(token: string) {
	AsyncStorage.setItem("session-token", token);
	GetUserInfos().then( (user) => {
		AsyncStorage.setItem("user-infos", JSON.stringify(user));
		router.push("/homePage/OpenDoorPage");

	}).catch( (error) => {
		console.error(error);
		router.push("/auth/login");
	})
}