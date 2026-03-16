// context/WeatherContext.js
import React, { createContext, useContext, useState } from 'react';

const WeatherContext = createContext();

export function WeatherProvider({ children }) {
  const [weatherCondition, setWeatherCondition] = useState(null);

  return (
    <WeatherContext.Provider value={{ weatherCondition, setWeatherCondition }}>
      {children}
    </WeatherContext.Provider>
  );
}

export function useWeather() {
  return useContext(WeatherContext);
}