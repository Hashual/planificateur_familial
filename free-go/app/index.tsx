import LoadFont from '@/utils/LoadFont';
import HomePage from './homePage/HomePage';
import CheckToken from '@/utils/api/auth/CheckToken';

export default function App() {
  const result = LoadFont({
    Pacifico: require('@/assets/fonts/Pacifico.ttf'),
  });
  if (result) { return result; }

  CheckToken();

  return <HomePage />;
}
