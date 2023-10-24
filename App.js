import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { AuthProvider } from './src/AuthContext';
import AppStack from './src/navigation/AppTabNav';
import Home from './src/screens/Home';


export default function App() {
  return (
    <AuthProvider>
        {/* <Home/> */}
        <AuthStack/>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
