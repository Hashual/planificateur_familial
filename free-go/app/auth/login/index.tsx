import LoginForm from "@/components/auth/forms/LoginForm";
import GoogleLoginButton from "@/components/auth/google/LoginButton";
import { RootView } from "@/components/utilities/RootView";
import { ThemedButton } from "@/components/utilities/ThemedButton";
import { SetBackPage } from "@/utils/SetBackPage";
import { router } from "expo-router";
import { View, StyleSheet } from "react-native";

function RedirectToRegister() {
	router.push("/auth/register");
}


function Login() {
	SetBackPage("/homePage/OpenDoorPage");
	return (
		<RootView padding={20} style={styles.container}>
			<LoginForm/>
			<View style={styles.create}>
				<GoogleLoginButton />
				<View style={{padding: 10}} />
				<ThemedButton title="Créer un compte" onPress={RedirectToRegister} />
			</View>
		</RootView>
	)
}

const styles = StyleSheet.create({ 
	container: {
		justifyContent: "center",
	},
	create: {
		paddingTop: 20,
		alignItems: "center",
		width: "100%",
	  },

});

export default Login;