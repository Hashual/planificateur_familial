import React, { useState } from "react";
import { TextInput, View, StyleSheet, TextInputProps } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

interface ThemedTextInputProps extends TextInputProps {
  icon?: string; // Nom de l'icône MaterialCommunityIcons
  onIconPress?: () => void; // Action à exécuter lorsqu'on clique sur l'icône
  secureTextEntry?: boolean; // Prend en charge la gestion de secureTextEntry
}

export const ThemedTextInput: React.FC<ThemedTextInputProps> = ({
  icon,
  onIconPress,
  secureTextEntry = false,
  style,
  ...props
}) => {
  const colors = useThemeColor();
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  const handleIconPress = () => {
    if (secureTextEntry) {
      setIsSecure(!isSecure);
    }
    if (onIconPress) {
      onIconPress();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.elementBackground }]}>
      <TextInput
        {...props}
        style={[styles.input, style]}
        secureTextEntry={isSecure}
        placeholderTextColor={colors.placeHolderText}
      />
      {icon && (
        <MaterialCommunityIcons
          name={icon as any}
          size={20}
          color={colors.fixedPrimaryText}
          style={styles.icon}
          onPress={handleIconPress}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
  },
  icon: {
    marginLeft: 10,
  },
});
