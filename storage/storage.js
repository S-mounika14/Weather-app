// Save and load data from phone storage

import AsyncStorage from '@react-native-async-storage/async-storage';

// Save last city
export async function saveCity(city) {
  await AsyncStorage.setItem('lastCity', city);
}

export async function getCity() {
  return await AsyncStorage.getItem('lastCity');
}

// Save recent searches (max 5)
export async function saveSearch(city) {
  const existing = await getSearches();
  const filtered = existing.filter(
    (c) => c.toLowerCase() !== city.toLowerCase()
  );
  const updated = [city, ...filtered].slice(0, 5);
  await AsyncStorage.setItem('searches', JSON.stringify(updated));
}

export async function getSearches() {
  const data = await AsyncStorage.getItem('searches');
  return data ? JSON.parse(data) : [];
}

export async function clearSearches() {
  await AsyncStorage.removeItem('searches');
}

// Save temperature unit C or F
export async function saveTempUnit(unit) {
  await AsyncStorage.setItem('tempUnit', unit);
}

export async function getTempUnit() {
  const unit = await AsyncStorage.getItem('tempUnit');
  return unit || 'C';
}

export async function saveDarkMode(value) {
  await AsyncStorage.setItem('darkMode', JSON.stringify(value));
}

export async function getDarkMode() {
  const val = await AsyncStorage.getItem('darkMode');
  return val ? JSON.parse(val) : true;
}