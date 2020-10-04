import React from 'react';
import Login from './src/Login';
import MobileAuth from './src/MobileAuth';
import Home from './src/Home';
import Mealkit from './src/MealKit';
import Receipt from './src/Receipt';
import Signup from './src/Signup';
import TrackOrder from './src/TrackOrder';
import OrderHistory from './src/OrderHistory';
import firebase from 'firebase';
import {firebaseConfig} from './src/config';
import { AntDesign } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';

//import libraries for navigation
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

//create stack navigator
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {

  //Initializing firebase instance
  firebase.initializeApp(firebaseConfig);

  const createTabs = () => {
    return(
      <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({color}) => {
          if (route.name === 'Home') {
            return <AntDesign name="home" size={24} color={color} />
          } else if (route.name === 'OrderHistory') {
            return <MaterialIcons name="history" size={24} color={color} />
          }
        },
      })}
      tabBarOptions={{
        activeTintColor: 'tomato',
        inactiveTintColor: 'gray',
      }}
      >
      <Tab.Screen name="Home" children={createStacks}/>
      <Tab.Screen name="OrderHistory" component={OrderHistory}/>
    </Tab.Navigator>
    );
  }

  const createStacks = () => {
    return(
      <Stack.Navigator
        screenOptions={{
          headerShown: true,
        }}
      >
        <Stack.Screen name="Home" component={Home} options={{headerLeft: null}}/>
        <Stack.Screen name="MealKit" component={Mealkit}/>
        <Stack.Screen name="Receipt" component={Receipt}/>
        <Stack.Screen name="Track Order" component={TrackOrder}/>
      </Stack.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login}/>
        <Stack.Screen name="Mobile Authentication" component={MobileAuth}/>
        <Stack.Screen name="Signup" component={Signup}/>
        <Stack.Screen name="Main" children={createTabs} options={{headerShown: false, gestureEnabled: false}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
