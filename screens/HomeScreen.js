import React, { useState, useEffect } from 'react';
import LottieView from 'lottie-react-native';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import * as Location from 'expo-location';
import { useTheme } from '../context/ThemeContext';
import { DARK, LIGHT } from '../constants/config';
import { getWeatherByLocation, getWeatherByCity } from '../services/weatherService';
import { showTemp, windSpeed, visibility, unixToTime, todayDate, getGradient, isNight } from '../utils/helpers';
import { saveCity, getCity, getTempUnit } from '../storage/storage';
import { useWeather } from '../context/WeatherContext';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { StatusBar } from 'react-native';




export default function HomeScreen() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('C');
  const { isDark } = useTheme();
  const { setWeatherCondition } = useWeather();

  const COLORS = isDark ? DARK : LIGHT;
  const night = isNight();
  const weatherAnimations = {
    Clear: night ? require('../assets/lottie/clear-night.json') : require('../assets/lottie/sunny.json'),
    Clouds: require('../assets/lottie/Clouds.json'),
    Rain: require('../assets/lottie/rainy.json'),
    Drizzle: require('../assets/lottie/rainy.json'),
    Thunderstorm: require('../assets/lottie/storm.json'),
    Snow: require('../assets/lottie/snowfall.json'),
    Mist: require('../assets/lottie/mist.json'),
    Fog: require('../assets/lottie/mist.json'),
    Haze: require('../assets/lottie/mist.json'),
  };



  const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 36 },
    scroll: { padding: 12, paddingBottom: 10 },
    center: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center', padding: 20 },
    lottieLoading: { width: 140, height: 140 },
    loadingText: { color: COLORS.blue, marginTop: 12, fontSize: 16, fontWeight: '600' },
    errorEmoji: { fontSize: 48, marginBottom: 12 },
    errorText: { color: '#FCA5A5', fontSize: 15, textAlign: 'center', marginBottom: 20 },
    retryBtn: { backgroundColor: '#2563EB', paddingHorizontal: 28, paddingVertical: 12, borderRadius: 12 },
    retryText: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
    header: { alignItems: 'center', marginBottom: 8, marginTop: 4 },
    city: { fontSize: 18, fontWeight: '700', color: '#FFFFFF' },
    date: { fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 2 },
    mainCard: {
      backgroundColor: COLORS.card,
      borderRadius: 22,
      alignItems: 'center',
      padding: 12,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: COLORS.cardBorder,
    },
    weatherIcon: { width: 80, height: 80 },
    temp: { fontSize: 56, fontWeight: '800', color: '#FFFFFF' },
    condition: { fontSize: 11, color: 'rgba(255,255,255,0.75)', letterSpacing: 2, marginTop: 2 },
    feelsLike: { fontSize: 12, color: 'rgba(255,255,255,0.55)', marginTop: 4 },
    highLowRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 8,
      backgroundColor: 'rgba(255,255,255,0.1)',
      paddingHorizontal: 16,
      paddingVertical: 6,
      borderRadius: 10,
    },
    highLow: { color: '#FFFFFF', fontSize: 13, fontWeight: '600', paddingHorizontal: 8 },
    dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.4)' },
    grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    detailBox: {
      backgroundColor: COLORS.card,
      borderRadius: 14,
      width: '31%',
      alignItems: 'center',
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: COLORS.cardBorder,
    },
    detailAnimation: { width: 32, height: 32, marginBottom: 2 },
    detailValue: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },
    detailLabel: { color: COLORS.darkGrey, fontSize: 10, marginTop: 1 },
  });

  useFocusEffect(
  useCallback(() => {
    StatusBar.setBarStyle(night ? 'light-content' : 'dark-content');
  }, [night])
);

  useEffect(() => {
    loadWeather();

    const interval = setInterval(() => {
      setRefreshing(false);
      loadWeather();
    }, 600000); // 10 minutes

    return () => clearInterval(interval);
  }, []);

  async function loadWeather() {
    try {
      setError('');
      const savedUnit = await getTempUnit();
      setUnit(savedUnit);

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        const data = await getWeatherByLocation(
          location.coords.latitude,
          location.coords.longitude
        );
        setWeather(data);
        setWeatherCondition(data.weather[0].main);
        await saveCity(data.name);
      } else {
        const lastCity = await getCity() || 'Hyderabad';
        const data = await getWeatherByCity(lastCity);
        setWeather(data);
      }
    } catch (err) {
      setError('Could not load weather. Check your internet.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  function onRefresh() {
    setRefreshing(true);
    loadWeather();
  }


  if (loading) {
    return (
      <View style={styles.center}>
        <LottieView 
          source={require('../assets/lottie/searching.json')}
          autoPlay 
          loop 
          style={styles.lottieLoading} 
        />
        <Text style={styles.loadingText}>Detecting your location...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorEmoji}>😕</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={loadWeather}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!weather) return null;

  const gradient = getGradient(weather.weather[0].main);


  return (
    <>
      {/* <StatusBar style={night ? 'light' : (isDark ? 'light' : 'dark')} /> */}
      {/* <StatusBar style={night ? 'light' : 'dark'} /> */}
     <View style={[styles.container, { backgroundColor: gradient[0] }]}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" progressViewOffset={40}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <LottieView
                source={require('../assets/lottie/locations.json')}
                autoPlay
                loop
                style={{ width: 28, height: 28 }}
              />
              <Text style={styles.city}>{weather.name}, {weather.sys.country}</Text>
            </View>
            <Text style={styles.date}>{todayDate()}</Text>
          </View>

          <View style={styles.mainCard}>
            <LottieView
              source={weatherAnimations[weather.weather[0].main] || weatherAnimations['Clouds']}
              autoPlay
              loop
              style={styles.weatherIcon}
            />
            <Text style={styles.temp}>{showTemp(weather.main.temp, unit)}</Text>
            <Text style={styles.condition}>{weather.weather[0].description.toUpperCase()}</Text>
            <Text style={styles.feelsLike}>Feels like {showTemp(weather.main.feels_like, unit)}</Text>
            <View style={styles.highLowRow}>
              <Text style={styles.highLow}>↑ {showTemp(weather.main.temp_max, unit)}</Text>
              <View style={styles.dot} />
              <Text style={styles.highLow}>↓ {showTemp(weather.main.temp_min, unit)}</Text>
            </View>
          </View>

          <View style={styles.grid}>
            <DetailBox styles={styles} animation={require('../assets/lottie/humidity.json')} label="Humidity" value={`${weather.main.humidity}%`} />
            <DetailBox styles={styles} animation={require('../assets/lottie/wind.json')} label="Wind" value={windSpeed(weather.wind.speed)} />
            <DetailBox styles={styles} animation={require('../assets/lottie/Visibility.json')} label="Visibility" value={visibility(weather.visibility)} />
            <DetailBox styles={styles} animation={require('../assets/lottie/hot-temperature.json')} label="Pressure" value={`${weather.main.pressure} hPa`} />
            <DetailBox styles={styles} animation={require('../assets/lottie/sunrise.json')} label="Sunrise" value={unixToTime(weather.sys.sunrise)} />
            <DetailBox styles={styles} animation={require('../assets/Weather/sunset.png')} label="Sunset" value={unixToTime(weather.sys.sunset)} />
          </View>
        </ScrollView>
      </View>
    </>
  );
}

function DetailBox({ styles, animation, label, value }) {
  return (
    <View style={styles.detailBox}>
      {typeof animation === "number" ? (
        <Image
          source={animation}
          style={{ width: 32, height: 32, marginBottom: 2 }}
          resizeMode="contain"
        />
      ) : (
        <LottieView source={animation} autoPlay loop style={styles.detailAnimation} />
      )}

      <Text style={styles.detailValue}>{value}</Text>
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
  );
}

// container: { flex: 1, paddingTop: 30 },
//   scroll: { padding: 20, paddingBottom: 40 },
//   center: {
//     flex: 1,
//     backgroundColor: COLORS.background,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },

//   loadingText: { color: COLORS.blue, marginTop: 12, fontSize: 14 },

//   errorEmoji: { fontSize: 48, marginBottom: 12 },
//   errorText: {
//     color: '#FCA5A5',
//     fontSize: 15,
//     textAlign: 'center',
//     marginBottom: 20,
//   },
//   retryBtn: {
//     backgroundColor: '#2563EB',
//     paddingHorizontal: 28,
//     paddingVertical: 12,
//     borderRadius: 12,
//   },
//   retryText: { color: COLORS.white, fontWeight: '700', fontSize: 15 },

//   header: { alignItems: 'center', marginBottom: 20, marginTop: 10 },
//   city: { fontSize: 22, fontWeight: '700', color: COLORS.white },
//   date: { fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 4 },

//   mainCard: {
//     backgroundColor: COLORS.card,
//     borderRadius: 28,
//     alignItems: 'center',
//     padding: 28,
//     marginBottom: 20,
//     borderWidth: 1,
//     borderColor: COLORS.cardBorder,
//   },
//   weatherIcon: { width: 120, height: 120 },
//   temp: { fontSize: 72, fontWeight: '800', color: COLORS.white },
//   condition: {
//     fontSize: 13,
//     color: 'rgba(255,255,255,0.75)',
//     letterSpacing: 2,
//     marginTop: 4,
//   },
//   feelsLike: {
//     fontSize: 14,
//     color: 'rgba(255,255,255,0.55)',
//     marginTop: 8,
//   },
//   highLowRow: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginTop: 16,
//     backgroundColor: 'rgba(255,255,255,0.1)',
//     paddingHorizontal: 20,
//     paddingVertical: 8,
//     borderRadius: 12,
//   },
//   highLow: {
//     color: COLORS.white,
//     fontSize: 15,
//     fontWeight: '600',
//     paddingHorizontal: 10,
//   },
//   detailAnimation: {
//     width: 40,
//     height: 40,
//     marginBottom: 4,
//   },
//   dot: {
//     width: 4,
//     height: 4,
//     borderRadius: 2,
//     backgroundColor: 'rgba(255,255,255,0.4)',
//   },

//   grid: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     gap: 10,
//   },
//   detailBox: {
//     backgroundColor: COLORS.card,
//     borderRadius: 18,
//     width: '31%',
//     alignItems: 'center',
//     paddingVertical: 16,
//     borderWidth: 1,
//     borderColor: COLORS.cardBorder,
//   },
//   detailIcon: { fontSize: 22, marginBottom: 6 },
//   detailValue: { color: COLORS.white, fontSize: 13, fontWeight: '700' },
//   detailLabel: { color: COLORS.darkGrey, fontSize: 11, marginTop: 2 },
// });