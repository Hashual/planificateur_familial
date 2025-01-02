import LoginForm from "@/components/auth/forms/LoginForm";
import GoogleLoginButton from "@/components/auth/google/LoginButton";
import { ThemedButton } from "@/components/utilities/ThemedButton";
import { router } from "expo-router";
import { View, StyleSheet } from "react-native";

function RedirectToRegister() {
	router.push("/auth/register");
}

function Login() {
	return (
		<View style={styles.container}>
			<LoginForm/>
			<View style={styles.create}>
				<GoogleLoginButton />
				<View style={{padding: 10}} />
				<ThemedButton title="Créer un compte" onPress={RedirectToRegister} />
			</View>
		</View>
	)
}

const styles = StyleSheet.create({ 
	container: {
		width: "100%",
		height: "100%",
		padding: 20,
		justifyContent: "center",
	},
	create: {
		paddingTop: 20,
		alignItems: "center",
		width: "100%",
	  },

});

export default Login;