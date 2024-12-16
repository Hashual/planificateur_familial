import LoadFont from '@/utils/LoadFont';
import HomePage from './homePage/HomePage';

export default function App() {
  const result = LoadFont({
    Pacifico: require('@/assets/fonts/Pacifico.ttf'),
  });
  if (result) { return result; }

  return <HomePage />;
}
