import HomePage from './homePage/HomePage';
import CheckToken from '@/utils/api/auth/CheckToken';

export default function App() {
  CheckToken();

  return <HomePage />;

}
