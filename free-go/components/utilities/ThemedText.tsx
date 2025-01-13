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
  align?: keyof typeof textAlign,
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
  bold: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  mainTitle: {
    fontSize: 48,
    fontFamily: "Pacifico"
  },
  title: {
    fontSize: 32,
    fontFamily: "Pacifico",
    marginBottom: 10
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  fs10: {
    fontSize: 10,
  },
  fs14: {
    fontSize: 14,
  },
  fs20: {
    fontSize: 20,
  },
  fs11Bold: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});
