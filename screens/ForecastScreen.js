import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  SafeAreaView,
  Image,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { DARK, LIGHT } from '../constants/config';
import { getForecastByCity } from '../services/weatherService';
import { showTemp, getDailyForecast } from '../utils/helpers';
import { getCity, getTempUnit } from '../storage/storage';
import { RefreshControl } from 'react-native';
import LottieView from 'lottie-react-native';


const weatherImages = {
  Clear: require('../assets/Weather/clear-day.png'),
  Clouds: require('../assets/Weather/partly-cloudy-day.png'),
  Rain: require('../assets/Weather/rain.png'),
  Drizzle: require('../assets/Weather/drizzle.png'),
  Thunderstorm: require('../assets/Weather/thunderstorms.png'),
  Snow: require('../assets/Weather/snow.png'),
  Mist: require('../assets/Weather/mist.png'),
  Fog: require('../assets/Weather/mist.png'),
  Haze: require('../assets/Weather/mist.png'),
};

export default function ForecastScreen() {
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unit, setUnit] = useState('C');
  const [city, setCity] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const { isDark } = useTheme();
  const COLORS = isDark ? DARK : LIGHT;

  const styles = React.useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    center: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', alignItems: 'center' },
    inner: { flex: 1, paddingHorizontal: 15, paddingTop: 40 },
    loadingText: { color: COLORS.blue, marginTop: 12 },
    errorText: { color: '#FCA5A5', marginBottom: 12 },
    title: { fontSize: 26, fontWeight: '800', color: COLORS.white, marginTop: 18 },
    cityText: { color: COLORS.grey, fontSize: 13, marginBottom: 2, marginTop: 4 },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.card,
      borderRadius: 16,
      paddingHorizontal: 14,
      paddingVertical: 12,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: COLORS.cardBorder,
    },
    todayRow: { borderColor: COLORS.blue, backgroundColor: 'rgba(37,99,235,0.2)' },
    dayCol: { width: 72 },
    dayName: { color: COLORS.white, fontSize: 14, fontWeight: '700' },
    todayText: { color: COLORS.blue },
    dateStr: { color: COLORS.darkGrey, fontSize: 11, marginTop: 2 },
    icon: { width: 44, height: 44, marginRight: 8 },
    desc: { flex: 1, color: COLORS.grey, fontSize: 12, textTransform: 'capitalize' },
    tempCol: { alignItems: 'flex-end' },
    maxTemp: { color: COLORS.white, fontSize: 14, fontWeight: '700' },
    minTemp: { color: COLORS.darkGrey, fontSize: 12, marginTop: 2 },
  }), [COLORS]);

  useEffect(() => {
    loadForecast();

    const interval = setInterval(() => {
      loadForecast();
    }, 600000);

    return () => clearInterval(interval);
  }, []);

  function onRefresh() {
    setRefreshing(true);
    loadForecast();
  }



  async function loadForecast() {
    try {
      const savedUnit = await getTempUnit();
      setUnit(savedUnit);
      const savedCity = await getCity() || 'Hyderabad';
      setCity(savedCity);
      const data = await getForecastByCity(savedCity);
      const daily = getDailyForecast(data.list);
      setForecast(daily);
    } catch (err) {
      setError('Could not load forecast. Check your internet.');
    } finally {
      setLoading(false);
      setRefreshing(false);

    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.blue} />
        <Text style={styles.loadingText}>Loading forecast...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View style={styles.inner}>
        <Text style={styles.title}>7-Day Forecast</Text>
        {!!city && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <LottieView
              source={require('../assets/lottie/locations.json')}
              autoPlay
              loop
              style={{ width: 28, height: 28 }}
            />
            <Text style={styles.cityText}>{city}</Text>
          </View>
        )}
        {!!error && <Text style={styles.errorText}>{error}</Text>}

        <FlatList
          data={forecast}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ marginTop: 13 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.blue} progressViewOffset={30} />
          }
          renderItem={({ item, index }) => (
            <View style={[styles.row, index === 0 && styles.todayRow]}>
              <View style={styles.dayCol}>
                <Text style={[styles.dayName, index === 0 && styles.todayText]}>
                  {index === 0 ? 'Today' : item.dayName}
                </Text>
                <Text style={styles.dateStr}>{item.dateStr}</Text>
              </View>
              <Image
                source={weatherImages[item.condition] || weatherImages['Clouds']}
                style={styles.icon}
              />
              <Text style={styles.desc} numberOfLines={1}>{item.description}</Text>
              <View style={styles.tempCol}>
                <Text style={styles.maxTemp}>↑ {showTemp(item.max, unit)}</Text>
                <Text style={styles.minTemp}>↓ {showTemp(item.min, unit)}</Text>
              </View>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
}