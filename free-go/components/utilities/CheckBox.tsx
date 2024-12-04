import { useThemeColor } from '@/hooks/useThemeColor';
import { Text, StyleSheet } from 'react-native';

export type CheckBoxProps = {
    size?: number,
    isChecked: boolean,
}

export function CheckBox({size, isChecked}: CheckBoxProps) {
    const colors = useThemeColor();

    const dynamicStyle = {
        borderColor: colors.button,
        color: colors.backgroundWhite,
        width: size ?? 20,
        height: size ?? 20,
        backgroundColor: isChecked ? colors.button : 'transparent',
    }

    return <Text style={[styles.checkBox, dynamicStyle]}>✓</Text>;
}

const styles = StyleSheet.create({
    checkBox: {
        borderRadius: 9999,
        borderStyle: "solid",
        borderWidth: 1,
        textAlign: "center",
    }
});