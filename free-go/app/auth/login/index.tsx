import GoogleLoginButton from "@/components/auth/google/LoginButton";
import { ThemedButton } from "@/components/utilities/ThemedButton";
import { router } from "expo-router";
import { View } from "react-native";

function RedirectToRegister() {
	router.push("/auth/register");
}

export default function Login() {
	return (
		<View>
			<GoogleLoginButton />
			<ThemedButton title="Créer un compte" onPress={RedirectToRegister} />
		</View>
	)
}