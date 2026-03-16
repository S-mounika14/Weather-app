// Small helper functions used across all screens

// Show temperature based on user unit setting
export function showTemp(celsius, unit) {
  if (unit === 'F') {
    return `${Math.round((celsius * 9) / 5 + 32)}°F`;
  }
  return `${Math.round(celsius)}°C`;
}

// Convert Unix timestamp to time like "6:30 AM"
export function unixToTime(unix) {
  const date = new Date(unix * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

// Convert wind speed m/s to km/h
export function windSpeed(ms) {
  return Math.round(ms * 3.6) + ' km/h';
}

// Convert visibility meters to km
export function visibility(meters) {
  return (meters / 1000).toFixed(1) + ' km';
}

// Get today date like "Monday, March 3"
export function todayDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

// Check if night time
export function isNight() {
  const hour = new Date().getHours();
  return hour >= 18 || hour < 6;
}

// Get background gradient based on weather
export function getGradient(condition) {
  if (isNight()) return ['#020617', '#0F172A'];
  const gradients = {
    Clear: ['#87CEEB', '#4A90D9'],
    Clouds: ['#1E3A5F', '#475569'],
    Rain: ['#1E1B4B', '#3730A3'],
    Drizzle: ['#1E40AF', '#3B82F6'],
    Thunderstorm: ['#09090B', '#3B0764'],
    Snow: ['#E0F2FE', '#BAE6FD'],
    Mist: ['#1E293B', '#334155'],
    Fog: ['#1E293B', '#334155'],
    Haze: ['#78350F', '#B45309'],
  };
  return gradients[condition] || ['#0A0E1A', '#1E293B'];
}
// Process forecast list into daily summary
export function getDailyForecast(list) {
  const days = {};
  list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const key = date.toDateString();
    if (!days[key]) {
      days[key] = {
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dateStr: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        temps: [],
        conditions: [],
      };
    }
    days[key].temps.push(item.main.temp);
    days[key].conditions.push(item.weather[0].main);
  });
  return Object.values(days).slice(0, 7).map((day) => {
    const freq = {};
    day.conditions.forEach((c) => { freq[c] = (freq[c] || 0) + 1; });
    const condition = Object.keys(freq).reduce((a, b) => freq[a] > freq[b] ? a : b);
    return {
      ...day,
      condition: condition,
      description: condition === 'Clear' ? 'clear sky' : condition.toLowerCase(),
      // description: condition.toLowerCase(),
      min: Math.round(Math.min(...day.temps)),
      max: Math.round(Math.max(...day.temps)),
    };
  });
}

// Get next 8 time slots for hourly screen
export function getHourlyData(list) {
  return list.slice(0, 8).map((item) => {
    const date = new Date(item.dt * 1000);
    return {
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', hour12: true }),
      temp: Math.round(item.main.temp),
      condition: item.weather[0].main,
      icon: item.weather[0].icon,   

      hour: date.getHours(),
    };
  });
}