import { StyleSheet, Text, View, VirtualizedList } from 'react-native';
import Fpage from './components/Fpage';
import Secondpage from './components/Secondpage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const Stack=createNativeStackNavigator();
export default function App() {
  return (
    
     <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: '#bff5f5', // Change the background color of the header
        },
        headerTintColor: '#fff', // Change the text color of the header
        headerTitleStyle: {
          fontWeight: 'bold', // Change the font weight of the header title
        },
      }}>
        <Stack.Screen name="Home" component={Fpage} options={{ title: 'Home' }}/>
        <Stack.Screen name="previous" component={Secondpage}/>
      </Stack.Navigator>
     </NavigationContainer>
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
