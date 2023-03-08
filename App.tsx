import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import Navigation from './navigation';

export default function App() {
  const isLoadingComplete = useCachedResources();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider>
        <SafeAreaProvider>
          <Navigation />
          <StatusBar translucent={false} />
        </SafeAreaProvider>
      </Provider>
    );
  }
}
