import { BASE_URL } from "@/hooks/useAPI";
import { SaveAPIToken } from "@/utils/api/auth/SaveAPIToken";
import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from "react-native";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    fetch(`${BASE_URL}/auth/local/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password: password,
      }),
    })
      .then((response) => {
        response.json().then((res) => {
          if (res.code == 400) {
            if (res.errors && res.errors[0]) {
              alert(res.errors[0].message);
            }
          } else if (res.code == 200) {
            SaveAPIToken(res.data.token);
          }
        });
      })
      .catch(console.error);
  };

  return (
    <View>
      <Text style={styles.title}>Connexion</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default LoginForm;
