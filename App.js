import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { AuthProvider } from './src/navigation/AuthContext';
import AuthStack  from './src/navigation/AuthStack';
import AppTabNav from './src/navigation/AppTabNav';
import TaskStack from './src/navigation/TaskStack';


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
