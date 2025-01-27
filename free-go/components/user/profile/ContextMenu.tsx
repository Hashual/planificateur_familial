import { View } from "react-native"
import React from "react"
import { StyleSheet } from "react-native"
import { useThemeColor } from "@/hooks/useThemeColor"


interface ContextMenuProps {
    children?: React.ReactNode;
}

const contextMenu: React.FC<ContextMenuProps> = ( {children} ) => {


    return( 
    <View style={styles.container}>
        {children}
    </View>
);

};

const styles = StyleSheet.create({
    container:{
        alignItems: 'center',
        width: '80%',
        height: '100%',
        borderWidth: 1,
        borderColor: 'black',
        borderRadius: 10,
    }

});

export default  contextMenu

