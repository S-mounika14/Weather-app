// All API calls are here

import axios from 'axios';
import { API_KEY, BASE_URL } from '../constants/config';

// Get weather by city name
export async function getWeatherByCity(city) {
  const response = await axios.get(
    `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
  );
  return response.data;
}

// Get weather by GPS coordinates
export async function getWeatherByLocation(lat, lon) {
  const response = await axios.get(
    `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  return response.data;
}

// Get 5 day forecast by city name
export async function getForecastByCity(city) {
  const response = await axios.get(
    `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&units=metric`
  );
  return response.data;
}

