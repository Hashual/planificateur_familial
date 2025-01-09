import HomePage from './homePage/HomePage';
import CheckToken from '@/utils/api/auth/CheckToken';
import RegisterForPushNotifications from '@/utils/api/notifications/RegisterForPushNotifications';

export default function App() {

    CheckToken();
    RegisterForPushNotifications();

  return <HomePage />;

}
