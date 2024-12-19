
import { API } from "@/constants/API";
import { SaveAPIToken } from "@/utils/api/auth/SaveAPIToken";
import { router } from "expo-router";
import React, { useState } from "react";
import { View, Button, TextInput } from "react-native";

export default function LoginForm() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const handleLogin = () => {
		fetch(`${API.URL}/auth/local/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				email,
				password: password
			})
		}).then( response => {
			response.json().then( (res) => {
				if (res.code == 400) {
					// TODO: Do it in another function
					if (res.errors && res.errors[0]) {
						alert(res.errors[0].message);
					}
				} else if (res.code == 200) {
					SaveAPIToken(res.data.token);
				}
			}).catch(console.error);
		}).catch(console.error);
	};

	return (
		<View>
			<TextInput
				placeholder="Email"
				value={email}
				onChangeText={setEmail} 
			/>
			<TextInput
				placeholder="Mot de passe"
				value={password}
				onChangeText={setPassword}
				secureTextEntry
			/>

			<Button
				title="Se connecter"
				onPress={handleLogin}
			/>
		</View>
	);
}