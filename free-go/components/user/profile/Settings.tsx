import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedSetting } from '@/components/utilities/ThemedSetting';
import { useRouter } from 'expo-router';

const Settings: React.FC = () => {
    const router = useRouter();
    

    return (
        <ThemedSetting
        title="Name"
        onPress={() => router.push('../user/settings/NameSetting')}
        type="primary"
        style={styles.button}
        />
            
    );
}

const styles = StyleSheet.create({ 
    container:{
        alignItems: 'center',
        justifyContent: 'center',
        width: '80%',
        height: '100%',
        borderWidth: 1,
        borderColor: 'black',
    },
    button: {
        marginVertical: 10,
        alignSelf: 'center',
        width: '80%',
      },
});

export default Settings;