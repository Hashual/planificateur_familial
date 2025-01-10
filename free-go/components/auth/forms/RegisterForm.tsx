import React, { useState } from "react";
import { RootView } from "@/components/utilities/RootView";
import { ThemedText } from "@/components/utilities/ThemedText";
import { ThemedButton } from "@/components/utilities/ThemedButton";
import { ThemedTextInput } from "@/components/utilities/ThemedTextInput";
import { BASE_URL } from "@/hooks/useAPI";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function RegisterForm() {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Pour le champ "Mot de passe"
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false); // Pour le champ "Confirmer le mot de passe"


  const colors = useThemeColor();

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
        lastName,
        firstName,
        email,
        password,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.code === 400 && res.errors?.[0]) {
          alert("Champ(s) invalide(s): ");
        } else if (res.status === 200) {
          alert("Inscription réussie");
        }
      })
      .catch(console.error);
  };

  return (
    <RootView padding={20} style={{ flex: 1 }}>
      <ThemedText variant="title" align="center">
        Inscription
      </ThemedText>
      <ThemedTextInput
        placeholder="Nom*"
        value={lastName}
        onChangeText={setLastName}
      />
      <ThemedTextInput
        placeholder="Prénom*"
        value={firstName}
        onChangeText={setFirstName}
      />
      <ThemedTextInput
        placeholder="Email*"
        value={email}
        onChangeText={setEmail}
      />
      <ThemedTextInput
        placeholder="Mot de passe*"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        icon={showPassword ? "eye" : "eye-off"}
        onIconPress={() => setShowPassword(!showPassword)}
      />
      <ThemedTextInput
        placeholder="Confirmer le mot de passe*"
        value={passwordConfirm}
        onChangeText={setPasswordConfirm}
        secureTextEntry
        icon={showPasswordConfirm ? "eye" : "eye-off"}
        onIconPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
      />
      <ThemedButton
        onPress={handleRegister}
        title="S'inscrire"
        style={{ alignSelf: "stretch", width: "100%" }}
      />
    </RootView>
  );
}
