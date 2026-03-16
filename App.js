// // App.js
// // Main entry point — navigation setup

// App.js
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SafeAreaProvider } from "react-native-safe-area-context";


import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import ForecastScreen from './screens/ForecastScreen';
import HourlyScreen from './screens/HourlyScreen';
import SearchScreen from './screens/SearchScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Same gradient map you already have in helpers.js
function getTabBarColor() {
  return '#0d1626';
}

function MainTabs() {
  const { weatherCondition } = useWeather();
  const { isDark } = useTheme();
  const tabBgColor = getTabBarColor(weatherCondition);
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
         backgroundColor: isDark ? "#0d1626" : "#ffffff",
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,

          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,

          paddingTop: 6
        },
        tabBarActiveTintColor: '#38bdf8',
        tabBarInactiveTintColor: '#334155',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          marginTop: 2,
        },
        tabBarIndicatorStyle: {
          backgroundColor: 'transparent',
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Today',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <View style={{
                width: 28,
                height: 2,
                borderRadius: 2,
                backgroundColor: focused ? '#38bdf8' : 'transparent',
                marginBottom: 4,
              }} />
              <Ionicons name="home-outline" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Forecast"
        component={ForecastScreen}
        options={{
          tabBarLabel: 'Forecast',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <View style={{
                width: 28,
                height: 2,
                borderRadius: 2,
                backgroundColor: focused ? '#38bdf8' : 'transparent',
                marginBottom: 4,
              }} />
              <Ionicons name="calendar-outline" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Hourly"
        component={HourlyScreen}
        options={{
          tabBarLabel: 'Hourly',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <View style={{
                width: 28,
                height: 2,
                borderRadius: 2,
                backgroundColor: focused ? '#38bdf8' : 'transparent',
                marginBottom: 4,
              }} />
              <Ionicons name="bar-chart-outline" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <View style={{
                width: 28,
                height: 2,
                borderRadius: 2,
                backgroundColor: focused ? '#38bdf8' : 'transparent',
                marginBottom: 4,
              }} />
              <Ionicons name="search-outline" size={22} color={color} />
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <View style={{ alignItems: 'center' }}>
              <View style={{
                width: 28,
                height: 2,
                borderRadius: 2,
                backgroundColor: focused ? '#38bdf8' : 'transparent',
                marginBottom: 4,
              }} />
              <Ionicons name="settings-outline" size={22} color={color} />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function MainApp() {
  const { isDark } = useTheme();
  return (
    <>
      {/* <StatusBar style="light" /> */}
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <WeatherProvider>
        <MainApp />
      </WeatherProvider>
    </ThemeProvider>
  );
}


