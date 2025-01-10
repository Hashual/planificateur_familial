import React, { useState } from "react";
import { RootView } from "@/components/utilities/RootView";
import { ThemedText } from "@/components/utilities/ThemedText";
import { ThemedButton } from "@/components/utilities/ThemedButton";
import { ThemedTextInput } from "@/components/utilities/ThemedTextInput";
import { BASE_URL } from "@/hooks/useAPI";
import { useThemeColor } from "@/hooks/useThemeColor";
import { router } from "expo-router";

export default function RegisterForm() {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [errors, setErrors] = useState({
    lastName: "",
    firstName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const colors = useThemeColor();

  const handleRegister = () => {
    const newErrors: typeof errors = {
      lastName: "",
      firstName: "",
      email: "",
      password: "",
      passwordConfirm: "",
    };

    if (!lastName.trim()) {
      newErrors.lastName = "Nom requis";
    }
    if (!firstName.trim()) {
      newErrors.firstName = "Prénom requis";
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email invalide";
    }
    if (!password.trim() || password.length < 8) {
      newErrors.password = "Mot de passe invalide (8 caractères min.)";
    }
    if (password !== passwordConfirm) {
      newErrors.passwordConfirm = "Les mots de passe ne correspondent pas";
    }

    setErrors(newErrors);

    if (Object.values(newErrors).some((error) => error)) {
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
        console.log(res);
        if (res.code === 400 && res.errors?.[0]) {
          const serverErrors = res.errors.reduce(
            (acc: typeof errors, error: { path: string }) => {
              if (error.path === "email") acc.email = "Email déjà utilisé";
              return acc;
            },
            { ...errors }
          );
          setErrors(serverErrors);
        } else if (res.code === 200) {
          router.replace("/auth/login");
          
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
        onChangeText={(text) => {
          setLastName(text);
          setErrors((prev) => ({ ...prev, lastName: "" }));
        }}
        error={!!errors.lastName}
        errorText={errors.lastName}
      />
      <ThemedTextInput
        placeholder="Prénom*"
        value={firstName}
        onChangeText={(text) => {
          setFirstName(text);
          setErrors((prev) => ({ ...prev, firstName: "" }));
        }}
        error={!!errors.firstName}
        errorText={errors.firstName}
      />
      <ThemedTextInput
        placeholder="Email*"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrors((prev) => ({ ...prev, email: "" }));
        }}
        error={!!errors.email}
        errorText={errors.email}
      />
      <ThemedTextInput
        placeholder="Mot de passe*"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setErrors((prev) => ({ ...prev, password: "" }));
        }}
        secureTextEntry={!showPassword}
        icon={showPassword ? "eye" : "eye-off"}
        onIconPress={() => setShowPassword(!showPassword)}
        error={!!errors.password}
        errorText={errors.password}
      />
      <ThemedTextInput
        placeholder="Confirmer le mot de passe*"
        value={passwordConfirm}
        onChangeText={(text) => {
          setPasswordConfirm(text);
          setErrors((prev) => ({ ...prev, passwordConfirm: "" }));
        }}
        secureTextEntry={!showPasswordConfirm}
        icon={showPasswordConfirm ? "eye" : "eye-off"}
        onIconPress={() => setShowPasswordConfirm(!showPasswordConfirm)}
        error={!!errors.passwordConfirm}
        errorText={errors.passwordConfirm}
      />
      <ThemedButton
        onPress={handleRegister}
        title="S'inscrire"
        style={{ alignSelf: "stretch", width: "100%" }}
      />
    </RootView>
  );
}
