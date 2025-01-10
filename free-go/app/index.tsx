import HomePage from './homePage/HomePage';
import CheckToken from '@/utils/api/auth/CheckToken';
import { IsLogin } from '@/utils/api/auth/IsLogin';
import RegisterForPushNotifications from '@/utils/api/notifications/RegisterForPushNotifications';
import Login from './auth/login';

export default async function App() {

    CheckToken();
    RegisterForPushNotifications();

  if (await IsLogin()) {
    return <HomePage />;
  }else  {
    return <Login />;
  }
}
