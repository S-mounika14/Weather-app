import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import { useTheme } from '../context/ThemeContext';
import { DARK, LIGHT } from '../constants/config';
import { saveTempUnit, getTempUnit, clearSearches } from '../storage/storage';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';




export default function SettingsScreen() {
  const [unit, setUnit] = useState('C');
  const [showClearModal, setShowClearModal] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const COLORS = isDark ? DARK : LIGHT;

  const styles = React.useMemo(() => StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    inner: { flex: 1, padding: 20 },
    title: { fontSize: 26, fontWeight: '800', color: COLORS.white, marginBottom: 24, marginTop: 40 },
    sectionLabel: { color: COLORS.blue, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 5, marginTop: 4 },
    unitRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
    unitBtn: { flex: 1, backgroundColor: COLORS.card, borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder },
    unitActive: { backgroundColor: 'rgba(37,99,235,0.25)', borderColor: COLORS.blue },
    unitText: { color: COLORS.grey, fontSize: 14, fontWeight: '600' },
    unitActiveText: { color: COLORS.white },
    toggleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: COLORS.card, borderRadius: 14, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: COLORS.cardBorder },
    toggleLabel: { color: COLORS.white, fontSize: 15, fontWeight: '600' },
    toggleDesc: { color: COLORS.darkGrey, fontSize: 12, marginTop: 2 },
    toggleBtn: { backgroundColor: '#959dab', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
    toggleBtnActive: { backgroundColor: '#6290f4' },
    toggleText: { color: COLORS.white, fontSize: 13, fontWeight: '700' },
    deleteBtn: { backgroundColor: 'rgba(239,68,68,0.1)', borderRadius: 12, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: 'rgba(239,68,68,0.25)' },
    deleteBtnText: { color: '#FCA5A5', fontSize: 14, fontWeight: '600' },
    aboutCard: { backgroundColor: COLORS.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: COLORS.cardBorder, gap: 6 },
    appName: { color: COLORS.white, fontSize: 16, fontWeight: '800' },
    aboutLine: { color: COLORS.grey, fontSize: 13 },
    modalBox: { backgroundColor: COLORS.tabBar, borderRadius: 20, padding: 24, alignItems: 'center' },
    modalTitle: { color: COLORS.white, fontSize: 20, fontWeight: '800', marginBottom: 8 },
    modalDesc: { color: COLORS.grey, fontSize: 14, textAlign: 'center', marginBottom: 24 },
    modalButtons: { flexDirection: 'row', gap: 12, width: '100%' },
    cancelBtn: { flex: 1, backgroundColor: COLORS.card, borderRadius: 12, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder },
    cancelText: { color: COLORS.white, fontWeight: '700' },
    deleteConfirmBtn: { flex: 1, backgroundColor: '#EF4444', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
    deleteConfirmText: { color: '#FFFFFF', fontWeight: '700' },
  }), [COLORS]);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const savedUnit = await getTempUnit();
    setUnit(savedUnit);
  }

 
  async function changeUnit(selected) {
    setUnit(selected);
    await saveTempUnit(selected);
  }

 

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View style={styles.inner}>

        <Text style={styles.title}>Settings</Text>

        <Text style={styles.sectionLabel}>TEMPERATURE UNIT</Text>
        <View style={styles.unitRow}>
          <TouchableOpacity style={[styles.unitBtn, unit === 'C' && styles.unitActive]} onPress={() => changeUnit('C')}>
            <Text style={[styles.unitText, unit === 'C' && styles.unitActiveText]}>°C  Celsius</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.unitBtn, unit === 'F' && styles.unitActive]} onPress={() => changeUnit('F')}>
            <Text style={[styles.unitText, unit === 'F' && styles.unitActiveText]}>°F  Fahrenheit</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionLabel}>APPEARANCE</Text>
        <TouchableOpacity style={styles.toggleRow} onPress={toggleTheme}>
          <View>
            <Text style={styles.toggleLabel}>Dark Mode</Text>
            <Text style={styles.toggleDesc}>Use dark theme</Text>
          </View>
          <View style={[styles.toggleBtn, isDark && styles.toggleBtnActive]}>
            <Text style={styles.toggleText}>{isDark ? 'ON' : 'OFF'}</Text>
          </View>
        </TouchableOpacity>

        

        <Text style={styles.sectionLabel}>DATA</Text>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => setShowClearModal(true)}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Ionicons name="trash" size={20} color="#FCA5A5" />
            <Text style={styles.deleteBtnText}>Clear Search History</Text>
          </View>
        </TouchableOpacity>

        <Text style={styles.sectionLabel}>ABOUT</Text>
        <View style={styles.aboutCard}>
          <Text style={styles.appName}>⛅ WeatherNow</Text>
          <Text style={styles.aboutLine}>Version 1.0.0</Text>
          <Text style={styles.aboutLine}>Powered by OpenWeatherMap API</Text>
          <Text style={styles.aboutLine}>Built with React Native + Expo</Text>
        </View>

      </View>

      <Modal isVisible={showClearModal} onBackdropPress={() => setShowClearModal(false)}>
        <View style={styles.modalBox}>
          <Ionicons name="trash-outline" size={40} color={COLORS.white} />
          <Text style={styles.modalTitle}>Clear History</Text>
          <Text style={styles.modalDesc}>All recent searches will be deleted permanently.</Text>
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowClearModal(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.deleteConfirmBtn} onPress={async () => { await clearSearches(); setShowClearModal(false); }}>
              <Text style={styles.deleteConfirmText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}