import { ThemedText } from "@/components/utilities/ThemedText";
import { BASE_URL } from "@/hooks/useAPI";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SaveAPIToken } from "@/utils/api/auth/SaveAPIToken";
import RegisterForPushNotifications from "@/utils/api/notifications/RegisterForPushNotifications";
import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from "react-native";

const LoginForm: React.FC = () => {
  const colors = useThemeColor();
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
            RegisterForPushNotifications();
            SaveAPIToken(res.data.token);
          }
        });
      })
      .catch(console.error);
  };

  const inputStyles = {
    ...styles.input,
    backgroundColor: colors.elementBackground,
    color: colors.primaryText,
  }

  return (
    <View>
      <ThemedText variant="title">Connexion</ThemedText>
      <TextInput
        style={inputStyles}
        placeholder="Email"
        placeholderTextColor={colors.placeHolderText}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={inputStyles}
        placeholder="Mot de passe"
        placeholderTextColor={colors.placeHolderText}
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
  input: {
    width: "100%",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 15,
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
