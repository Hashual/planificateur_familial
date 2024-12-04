import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';
import LoadFont from '@/utils/LoadFont';

export type ThemedTextProps = TextProps & {
  variant?: keyof typeof styles,
  color?: keyof typeof Colors["light"]
};

export function ThemedText({variant, color, ...rest}: ThemedTextProps) {
  const colors = useThemeColor();
  const loadedError = LoadFont({
    "Pacifico": require("@/assets/fonts/Pacifico.ttf"),
  })
  if (loadedError) { return loadedError; }

  return (
    <Text style={[styles[variant ?? "default"], {color: colors[color ?? "text"]}]}></Text>
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: "Pacifico"
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: "Pacifico"
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
