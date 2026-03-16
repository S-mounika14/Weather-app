import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Image,
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '../context/ThemeContext';
import { DARK, LIGHT } from '../constants/config';
import { getForecastByCity } from '../services/weatherService';
import { showTemp, getHourlyData } from '../utils/helpers';
import { getCity, getTempUnit } from '../storage/storage';
import LottieView from 'lottie-react-native';
function getWeatherImage(icon) {
  const map = {
    '01d': require('../assets/Weather/clear-day.png'),
    '01n': require('../assets/Weather/clear-night.png'),
    '02d': require('../assets/Weather/partly-cloudy-day.png'),
    '02n': require('../assets/Weather/partly-cloudy-night.png'),
    '03d': require('../assets/Weather/partly-cloudy-day.png'),
    '03n': require('../assets/Weather/partly-cloudy-night.png'),
    '04d': require('../assets/Weather/cloudy.png'),
    '04n': require('../assets/Weather/cloudy.png'),
    '09d': require('../assets/Weather/rain.png'),
    '09n': require('../assets/Weather/rain.png'),
    '10d': require('../assets/Weather/rain.png'),
    '10n': require('../assets/Weather/rain.png'),
    '11d': require('../assets/Weather/thunderstorms.png'),
    '11n': require('../assets/Weather/thunderstorms.png'),
    '13d': require('../assets/Weather/snow.png'),
    '13n': require('../assets/Weather/snow.png'),
    '50d': require('../assets/Weather/mist.png'),
    '50n': require('../assets/Weather/mist.png'),
  };
  return map[icon] || require('../assets/Weather/clear-day.png');
}

export default function HourlyScreen() {
  const [hourly, setHourly] = useState([]);
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
    scroll: { padding: 20, paddingBottom: 40 },
    loadingText: { color: COLORS.blue, marginTop: 12 },
    errorText: { color: '#FCA5A5' },
    title: { fontSize: 26, fontWeight: '800', color: COLORS.white, marginTop: 40 },
    cityText: { color: COLORS.grey, fontSize: 13, marginBottom: 2, marginTop: 9 },
    summaryRow: { flexDirection: 'row', gap: 10, marginBottom: 20, marginTop: 15 },
    summaryCard: {
      flex: 1,
      backgroundColor: COLORS.card,
      borderRadius: 14,
      padding: 14,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: COLORS.cardBorder,
    },
    summaryValue: { fontSize: 17, fontWeight: '800' },
    summaryLabel: { color: COLORS.darkGrey, fontSize: 11, marginTop: 4 },
    iconScroll: {
      backgroundColor: COLORS.card,
      borderRadius: 18,
      paddingVertical: 14,
      marginBottom: 24,
      borderWidth: 1,
      borderColor: COLORS.cardBorder,
    },
    hourCard: { alignItems: 'center', paddingHorizontal: 14 },
    hourTime: { color: COLORS.grey, fontSize: 11, marginBottom: 6 },
    hourIcon: { width: 40, height: 40 },
    hourTemp: { color: COLORS.white, fontSize: 13, fontWeight: '700', marginTop: 6 },
    sectionLabel: { color: COLORS.grey, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 12 },
    barRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, gap: 10 },
    barTime: { color: COLORS.grey, fontSize: 12, width: 65 },
    barTrack: { flex: 1, height: 8, backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: 4, overflow: 'hidden' },
    barFill: { height: '100%', backgroundColor: COLORS.blue, borderRadius: 4 },
    barTemp: { color: COLORS.white, fontSize: 13, fontWeight: '600', width: 52, textAlign: 'right' },
  }), [COLORS]);

  useEffect(() => {
    loadHourly()

    const interval = setInterval(() => {
      loadHourly()
    }, 600000)

    return () => clearInterval(interval)
  }, [])

  function onRefresh() {
    setRefreshing(true);
    loadHourly();
  }

  async function loadHourly() {
    try {
      const savedUnit = await getTempUnit();
      setUnit(savedUnit);
      const savedCity = await getCity() || 'Hyderabad';
      setCity(savedCity);
      const data = await getForecastByCity(savedCity);
      const processed = getHourlyData(data.list);
      setHourly(processed);
    } catch (err) {
      setError('Could not load hourly data.');
    } finally {
      setLoading(false);
      setRefreshing(false);

    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.blue} />
        <Text style={styles.loadingText}>Loading hourly data...</Text>
      </View>
    );
  }

  if (error || hourly.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error || 'No data available'}</Text>
      </View>
    );
  }

  const temps = hourly.map((h) => h.temp);
  const maxTemp = Math.max(...temps);
  const minTemp = Math.min(...temps);
  const avgTemp = Math.round(temps.reduce((a, b) => a + b, 0) / temps.length);
  const range = maxTemp - minTemp || 1;

  return (
    
    <View style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.blue} progressViewOffset={120} />
        }
      >

        <Text style={styles.title}>Hourly Temperature</Text>
        {!!city && (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <LottieView
              source={require('../assets/lottie/locations.json')}
              autoPlay
              loop
              style={{ width: 26, height: 26 }}
            />
            <Text style={styles.cityText}>{city} — Next 24 hours</Text>
          </View>
        )}

        {/* {!!city && <Text style={styles.cityText}>📍 {city} — Next 24 hours</Text>} */}

        <View style={styles.summaryRow}>
          <SummaryCard styles={styles} label="Highest" value={showTemp(maxTemp, unit)} color="#F59E0B" />
          <SummaryCard styles={styles} label="Average" value={showTemp(avgTemp, unit)} color={COLORS.blue} />
          <SummaryCard styles={styles} label="Lowest" value={showTemp(minTemp, unit)} color="#34D399" />
        </View>

        <View style={styles.iconScroll}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {hourly.map((item, index) => (
              <View key={index} style={styles.hourCard}>
                <Text style={styles.hourTime}>{item.time}</Text>
                <Image
                  source={getWeatherImage(item.icon)}
                  style={styles.hourIcon}
                />
                <Text style={styles.hourTemp}>{showTemp(item.temp, unit)}</Text>
              </View>
            ))}
          </ScrollView>

        </View>

        <Text style={styles.sectionLabel}>TEMPERATURE BREAKDOWN</Text>

        {hourly.map((item, index) => {
          const barPercent = ((item.temp - minTemp) / range) * 100;
          return (
            <View key={index} style={styles.barRow}>
              <Text style={styles.barTime}>{item.time}</Text>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, { width: `${Math.max(barPercent, 8)}%` }]} />
              </View>
              <Text style={styles.barTemp}>{showTemp(item.temp, unit)}</Text>
            </View>
          );
        })}

      </ScrollView>
    </View>

  );
}

function SummaryCard({ styles, label, value, color }) {
  return (
    <View style={styles.summaryCard}>
      <Text style={[styles.summaryValue, { color }]}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}