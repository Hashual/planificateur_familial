
import { API } from "@/constants/API";
import { router } from "expo-router";
import React, { useState } from "react";
import { View, Button, TextInput } from "react-native";

export default function RegisterForm() {
	const [lastName, setLastName] = useState("");
	const [firstName, setFirstName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [passwordConfirm, setPasswordConfirm] = useState("");

	const handleRegister = () => {
		if (password != passwordConfirm) {
			// TODO: Update this alert to use a custom alert component
			alert("Les mots de passe ne correspondent pas");
			return;
		}

		fetch(`${API.URL}/auth/local/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				lastName: lastName,
				firstName: firstName,
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
				} else if (res.status == 200) {
					alert("Inscription réussie");
					router.push("/auth/login")
				}
			}).catch(console.error);
		}).catch(console.error);
	};

	return (
		<View>
			<TextInput 
				placeholder="Nom"
				value={lastName}
				onChangeText={setLastName} 
			/>
			<TextInput 
				placeholder="Prénom"
				value={firstName}
				onChangeText={setFirstName}
			/>
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
			<TextInput
				placeholder="Confirmer le mot de passe"
				value={passwordConfirm}
				onChangeText={setPasswordConfirm}
				secureTextEntry
			/>

			<Button
				title="S'inscrire"
				onPress={handleRegister}
			/>
		</View>
	);
}