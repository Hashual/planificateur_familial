import { useRef } from "react";
import { Pressable, TextInput, View, ViewStyle, StyleSheet } from "react-native";
import { ThemedText } from "./ThemedText";
import { ThemedButton } from "./ThemedButton";
import { useThemeColor } from "@/hooks/useThemeColor";

type DateInputProps = {
    number: number;
    setNumber: (value: number | ((prevNumber: number) => number)) => void;
    minValue: number;
    maxValue: number;
    maxLenght: number;
    style?: ViewStyle;
};

export default function NumberInput({number, setNumber, minValue, maxValue, maxLenght, style} : DateInputProps) {
    const colors = useThemeColor();
    const inputRef = useRef<TextInput>(null);

    const handleFocus = () => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
      };

    const handleIncrement = () => {
        if (number<maxValue) {
            setNumber(number + 1);
        }
    }
    
    const handleDecrement = () => {
        if (number>minValue) {
            setNumber(number - 1);
        }
    }

    const handleInputChange = (text: string) => {
        const numericValue = parseInt(text, 10);
        if (isNaN(numericValue)) {
            setNumber(0);
        } else {
            setNumber(numericValue);
        }
    };

    const textColor = {
        color: colors.primaryText
    }

    return (
    <View style={style}> 
        <Pressable style={styles.quantity} onPress={handleFocus}>
            <ThemedText variant="fs14">Quantité : </ThemedText>
            <TextInput
                ref={inputRef}
                value={number.toString()}
                onChangeText={(text) => handleInputChange(text)}
                keyboardType="numeric"
                maxLength={maxLenght}
                style={[styles.textInput, textColor]}
            />
        </Pressable>
        <View style={{flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
            <ThemedButton
                title="-"
                onPress={handleDecrement}
                type="primary"
                style={{paddingHorizontal: 18}}
            />
            <ThemedButton
                title="+"
                onPress={handleIncrement}
                type="primary"
                style={{marginLeft:10,paddingHorizontal: 17}}
            />
        </View>
    </View>
    );
}

const styles = StyleSheet.create({
    input: {
      width: "85%",
      borderWidth: 1,
      padding: 10,
      marginTop: 10,
      borderRadius: 5,
      flexDirection: "row",
      boxSizing: "border-box" as "border-box",
    },
    quantity: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center", 
      justifyContent: "flex-start",
      paddingRight: 2,
    },
    textInput: {
      padding: 0,
      margin: 0,
      height: "auto",
      width: "auto"
    },
  });