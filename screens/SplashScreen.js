// First screen when app opens
// Shows for 2.5 seconds then goes to main app

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { StatusBar } from 'expo-status-bar';


export default function SplashScreen({ navigation }) {

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('MainTabs');
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
       <LottieView
        source={require('../assets/lottie/splash-icon.json')}
        autoPlay
        loop={false}
        style={styles.animation}
      />
      <Text style={styles.appName}>WeatherNow</Text>
      <Text style={styles.tagline}>Real-time weather for your city</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E1A',
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
  width: 200,
  height: 200,
},
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  appName: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 14,
    color: '#94A3B8',
    marginTop: 8,
  },
});