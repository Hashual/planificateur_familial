import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSequence,
    withTiming,
} from 'react-native-reanimated';
import { useThemeColor } from '@/hooks/useThemeColor';

export type CheckBoxProps = {
    size?: number;
    isChecked: boolean;
};

export function CheckBox({ size = 20, isChecked }: CheckBoxProps) {
    const colors = useThemeColor();

    const scale = useSharedValue(1);

    useEffect(() => {
        if (isChecked) {
            scale.value = withSequence(
                withTiming(0.8, { duration: 100 }),
                withTiming(1.1, { duration: 150 }),
                withTiming(1, { duration: 150 })
            );
        } else {
            scale.value = withTiming(1, { duration: 150 });
        }
    }, [isChecked]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        backgroundColor: isChecked ? colors.primary : 'transparent',
        borderColor: colors.primary,
    }));

    return (
        <Animated.View style={[styles.checkBox, animatedStyle, { width: size, height: size }]}>
            {isChecked && <Text style={{ color: colors.elementBackground }}>✓</Text>}
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    checkBox: {
        borderRadius: 9999,
        borderStyle: 'solid',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
