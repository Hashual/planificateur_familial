import { useEffect } from "react";
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

import { useThemeColor } from "@/hooks/useThemeColor";

type ProgressBarProps = {
    nbItems: number,
    nbItemsCompleted: number,
};

export default function ProgressBar({ nbItems, nbItemsCompleted}: ProgressBarProps) {
    const colors = useThemeColor();
    const sharedValue = useSharedValue(nbItemsCompleted);
    const barInnerStyle = useAnimatedStyle(() => {
        if (nbItems===nbItemsCompleted) {
            return {
                flex: sharedValue.value,
                backgroundColor: colors.progressBarCompleted,
            }
        }
        return {
            flex: sharedValue.value,
            backgroundColor: colors.primary,
        }
    })
    const barBackgroundStyle = useAnimatedStyle(() => {
        return {
            flex: nbItems - sharedValue.value,
            backgroundColor: colors.primary,
        }
    })

    useEffect(() => {
        sharedValue.value = withSpring(nbItemsCompleted);
    }, [nbItemsCompleted]);
    
    return (
        <View style={styles.bar}>
            <Animated.View style={[styles.barInner, barInnerStyle]}/>
            <Animated.View style={[styles.barBackground, barBackgroundStyle]}/>
        </View>
    )
}

const styles = StyleSheet.create({
    bar: {
        flexDirection: 'row',
        alignItems: "center",
        borderRadius: 20,
        height: 4,
        overflow: 'hidden',
        flex: 1,
        marginTop: 8,
    },
    barInner: {
        height: 4,
    },
    barBackground: {
        height: 4,
        opacity: 0.2, 
    },
})