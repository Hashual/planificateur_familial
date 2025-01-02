import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ClearUserInfos() {
	AsyncStorage.removeItem("session-token");
	AsyncStorage.removeItem("user-infos");
}