import { ToDoList } from "@/mockapi/types";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect } from "react";
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";


type ProgressBarProps = {
    nbItems: number,
    nbItemsCompleted: number,
};

export default function ProgressBar({ nbItems, nbItemsCompleted}: ProgressBarProps) {

    const sharedValue = useSharedValue(nbItemsCompleted);
    const barInnerStyle = useAnimatedStyle(() => {
        if (nbItems===nbItemsCompleted) {
            return {
                flex: sharedValue.value,
                backgroundColor: "#149414",
            }
        }
        return {
            flex: sharedValue.value,
            backgroundColor: "#f5c755",
        }
    })
    const barBackgroundStyle = useAnimatedStyle(() => {
        return {
            flex: nbItems - sharedValue.value,
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
        backgroundColor: "#f5c755",
    },
    barBackground: {
        height: 4,
        opacity: 0.24, 
        backgroundColor: "#f8e098",
    },
})