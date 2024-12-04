import { Text, type TextProps, StyleSheet } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';
import LoadFont from '@/utils/LoadFont';

const textAlign = {
  left: 'left',
  center: 'center',
  right: 'right',
} as const;

export type ThemedTextProps = TextProps & {
  variant?: keyof typeof styles,
  color?: keyof typeof Colors["light"],
  align?: keyof typeof textAlign
};

export function ThemedText({variant, color, align, style, ...rest}: ThemedTextProps) {
  const colors = useThemeColor();
  const loadedError = LoadFont({
    "Pacifico": require("@/assets/fonts/Pacifico.ttf"),
  })
  if (loadedError) { return loadedError; }

  return (
    <Text style={[styles[variant ?? "default"], {color: colors[color ?? "primaryText"]}, {textAlign: align ?? "left"},  style]} {...rest}></Text>
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    fontFamily: "Pacifico"
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: "Pacifico",
    marginBottom: 10
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
