import { View, type ViewProps } from 'react-native';

import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';

export type ThemedViewProps = ViewProps & {
  color?: keyof typeof Colors;
};

export function ThemedView({ style, color, ...otherProps }: ThemedViewProps) {
  const colors = useThemeColor();

  return <View style={[{ backgroundColor: colors[color as keyof typeof colors ?? "background"] }, style]} {...otherProps} />;
}
