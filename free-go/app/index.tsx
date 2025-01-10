import HomePage from './homePage/HomePage';
import CheckToken from '@/utils/api/auth/CheckToken';
import { IsLogin } from '@/utils/api/auth/IsLogin';
import RegisterForPushNotifications from '@/utils/api/notifications/RegisterForPushNotifications';
import Login from './auth/login';
import WaitingScreen from '@/components/utilities/WaitingScreen';
import { router } from 'expo-router';

export default function App() {

    CheckToken();
    RegisterForPushNotifications();

    // Need a timeout here. Else, w'll have an infinite waiting screen
    setTimeout(() => {
        IsLogin().then( (isLogin) => {
            if (isLogin) {
                console.log('isLogin');
                router.replace('/homePage/DoorPage');
            } else {
                router.replace('/auth/login');
            }
        })
    }, 500)

    return <WaitingScreen />;
}
