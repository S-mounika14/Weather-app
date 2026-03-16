import React, { useState, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { DARK, LIGHT } from '../constants/config';
import { getWeatherByCity } from '../services/weatherService';
import { showTemp } from '../utils/helpers';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

import { saveSearch, getSearches, clearSearches, getTempUnit, saveCity } from '../storage/storage';

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

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [recentList, setRecentList] = useState([]);
  const [unit, setUnit] = useState('C');
  const { isDark } = useTheme();
  const COLORS = isDark ? DARK : LIGHT;

  const styles = React.useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    scroll: { padding: 20, paddingBottom: 40 },
    title: {
      fontSize: 26,
      fontWeight: '800',
      color: COLORS.white,
      marginBottom: 20,
      marginTop: 40,
    },
    searchRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
    input: {
      flex: 1,
      backgroundColor: COLORS.card,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 14,
      color: COLORS.white,
      fontSize: 15,
      borderWidth: 1,
      borderColor: COLORS.cardBorder,
    },
    searchBtn: { backgroundColor: '#6290f4', borderRadius: 14, paddingHorizontal: 18, justifyContent: 'center' },
    disabledBtn: { backgroundColor: '#374151' },
    searchBtnText: { fontSize: 20 },
    errorBox: {
      backgroundColor: 'rgba(239,68,68,0.12)',
      borderRadius: 12,
      padding: 14,
      borderWidth: 1,
      borderColor: 'rgba(239,68,68,0.3)',
      marginBottom: 16,
    },
    errorText: { color: '#FCA5A5', fontSize: 14 },
    resultCard: {
      backgroundColor: COLORS.card,
      borderRadius: 20,
      padding: 18,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24,
      borderWidth: 1,
      borderColor: COLORS.blue,
    },
    resultLeft: { flex: 1 },
    resultCity: { color: COLORS.white, fontSize: 18, fontWeight: '700' },
    resultDesc: { color: COLORS.grey, fontSize: 13, marginTop: 4, textTransform: 'capitalize' },
    resultExtra: { color: COLORS.darkGrey, fontSize: 12, marginTop: 6 },
    resultRight: { alignItems: 'center' },
    resultIcon: { width: 60, height: 60 },
    resultTemp: { color: COLORS.white, fontSize: 20, fontWeight: '800' },
    recentSection: { marginTop: 4 },
    recentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 12,
    },
    recentTitle: { color: COLORS.grey, fontSize: 11, fontWeight: '700', letterSpacing: 1 },
    clearText: { color: COLORS.red, fontSize: 13 },
    recentItem: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.card,
      borderRadius: 12,
      paddingHorizontal: 16,
      paddingVertical: 14,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: COLORS.cardBorder,
    },
    recentIcon: { fontSize: 16, marginRight: 12 },
    recentCity: { flex: 1, color: COLORS.white, fontSize: 15 },
    recentArrow: { color: COLORS.darkGrey, fontSize: 22 },
  }), [COLORS]);

  useFocusEffect(
  useCallback(() => {
    loadRecent();
    loadUnit();
  }, [])
);

  async function loadRecent() {
    const list = await getSearches();
    setRecentList(list);
  }

  async function loadUnit() {
    const savedUnit = await getTempUnit();
    setUnit(savedUnit);
  }

  async function handleSearch(cityName) {
    const city = cityName || query.trim();
    if (!city) return;
    try {
      setLoading(true);
      setError('');
      setResult(null);
      const data = await getWeatherByCity(city);
      setResult(data);
      await saveSearch(data.name);
      await saveCity(data.name);
      await loadRecent();
    } catch (err) {
      if (err.response?.status === 404) {
        setError('City not found. Please check the spelling.');
      } else {
        setError('Something went wrong. Check your internet.');
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleClear() {
    await clearSearches();
    setRecentList([]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>Search City</Text>

          <View style={styles.searchRow}>
            <TextInput
              style={styles.input}
              placeholder="Enter city name..."
              placeholderTextColor={COLORS.darkGrey}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={() => handleSearch()}
              returnKeyType="search"
            />
            <TouchableOpacity
              style={[styles.searchBtn, !query.trim() && styles.disabledBtn]}
              onPress={() => handleSearch()}
              disabled={!query.trim()}
            >
              <Ionicons name="search" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {loading && <ActivityIndicator color={COLORS.blue} style={{ marginTop: 20 }} />}

          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>❌  {error}</Text>
            </View>
          )}

          {result && !loading && (
            <View style={styles.resultCard}>
              <View style={styles.resultLeft}>
                <Text style={styles.resultCity}>{result.name}, {result.sys.country}</Text>
                <Text style={styles.resultDesc}>{result.weather[0].description}</Text>
                <Text style={styles.resultExtra}>
                  Humidity {result.main.humidity}%  •  Feels like {showTemp(result.main.feels_like, unit)}
                </Text>
              </View>
              <View style={styles.resultRight}>
                <Image
                  source={weatherImages[result.weather[0].main] || weatherImages['Clear']}
                  style={styles.resultIcon}
                />
                <Text style={styles.resultTemp}>{showTemp(result.main.temp, unit)}</Text>
              </View>
            </View>
          )}

          {recentList.length > 0 && (
            <View style={styles.recentSection}>
              <View style={styles.recentHeader}>
                <Text style={styles.recentTitle}>RECENT SEARCHES</Text>
                <TouchableOpacity onPress={handleClear}>
                  <Text style={styles.clearText}>Clear All</Text>
                </TouchableOpacity>
              </View>
              {recentList.map((city, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.recentItem}
                  onPress={() => { setQuery(city); handleSearch(city); }}
                >
                  <Ionicons name="time-outline" size={18} color={COLORS.grey} style={{ marginRight: 12 }} />
                  <Text style={styles.recentCity}>{city}</Text>
                  <Text style={styles.recentArrow}>›</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}