import { router, useLocalSearchParams } from "expo-router";
import React from "react";

export default function GoogleSignInCallback() {
	const { token } = useLocalSearchParams<{ token: string }>();
	if (token == "") {
		router.push("/auth/login");
	}
	return (
		<>
			<h1>Google Sign In Callback</h1>
			<p>Token: {token}</p>
		</>
	)
}