import axios from 'axios';

const API_KEY = import.meta.env.VITE_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

async function getCurrentWeather(city) {
  const url = `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&lang=pt_br&units=metric`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

async function get5DaysForecast(city) {
  const url = `${BASE_URL}/forecast?q=${city}&appid=${API_KEY}&lang=pt_br&units=metric`;
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
}

function handleApiError(error) {
  if (error.response && error.response.status === 404) {
    return new Error('Cidade não encontrada. Verifique o nome digitado.');
  } else {
    console.error(error);
    return new Error('Ocorreu um erro ao buscar os dados. Tente novamente mais tarde.');
  }
}

export { getCurrentWeather, get5DaysForecast };