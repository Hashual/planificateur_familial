import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { BASE_URL } from "@/hooks/useAPI";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedButton } from "@/components/utilities/ThemedButton";
import { RootView } from "@/components/utilities/RootView";
import { ThemedText } from "@/components/utilities/ThemedText";

export default function RegisterForm() {
  const colors = useThemeColor();
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handleRegister = () => {
    if (password !== passwordConfirm) {
      alert("Les mots de passe ne correspondent pas");
      return;
    }

    fetch(`${BASE_URL}/auth/local/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lastName: lastName,
        firstName: firstName,
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
          } else if (res.status == 200) {
            // TODO: Redirect to login page
            alert("Inscription réussie");
          }
        });
      })
      .catch(console.error);
  };

  const inputStyles = {
    ...styles.input,
    backgroundColor: colors.elementBackground
  }

  return (
    <RootView padding={20} style={styles.container}>
      <ThemedText variant="title" align="center">Inscription</ThemedText>
      <TextInput
        style={inputStyles}
        placeholder="Nom"
        placeholderTextColor={colors.placeHolderText}
        value={lastName}
        onChangeText={setLastName}
      />
      <TextInput
        style={inputStyles}
        placeholder="Prénom"
        placeholderTextColor={colors.placeHolderText}
        value={firstName}
        onChangeText={setFirstName}
      />
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
      <TextInput
        style={inputStyles}
        placeholder="Confirmer le mot de passe"
        placeholderTextColor={colors.placeHolderText}
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
        secureTextEntry
      />
      <ThemedButton onPress={handleRegister} title="S'inscrire" style={{alignSelf: 'stretch', width: '100%'}}/>
    </RootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
  },
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
  },
  button: {
    width: "100%",
    padding: 15,
    backgroundColor: Colors.light.primary,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: Colors.light.primaryText,
    fontWeight: "bold",
  },
});
