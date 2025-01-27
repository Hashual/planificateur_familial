import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedSetting } from '@/components/utilities/ThemedSetting';
import { useRouter } from 'expo-router';

const Settings: React.FC = () => {
    const router = useRouter();
    

    return (
        <ThemedSetting
        title="Name"
        onPress={() => router.push('/user/settings/[setting]')}
        type="primary"
        style={styles.button}
        />
            
    );
}

const styles = StyleSheet.create({ 
    button: {
        marginVertical: 10,
        alignSelf: 'center',
        width: '90%',
      },
});

export default Settings;