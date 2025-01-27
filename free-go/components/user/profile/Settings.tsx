import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ThemedSetting } from '@/components/utilities/ThemedSetting';
import { useRouter } from 'expo-router';
import { ScrollView } from 'react-native-gesture-handler';

const Settings: React.FC = () => {
    const router = useRouter();
    

    return (
        <ScrollView style={{flex: 1, width: '100%'}} contentContainerStyle={{alignItems: 'center'}}>
            <ThemedSetting
            title="Nom et prénom"
            onPress={() => router.push('/user/settings/[setting]')}
            type="primary"
            style={styles.button}
            />

            <ThemedSetting
            title="Adresse email"
            onPress={() => router.push('/user/settings/[setting]')}
            type="primary"
            style={styles.button}
            />
            
        </ScrollView>


        // mdp / ancien mdp / genre / surnom

            
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