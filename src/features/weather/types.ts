export interface WeatherDescription {
  id: number;
  main: string;
  description: string;
  icon: string;
}

export interface CurrentWeather {
  name: string;
  weather: WeatherDescription[];
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
    pressure: number;
  };
}

export interface ForecastSlot {
  dt: number;
  main: {
    temp_min: number;
    temp_max: number;
  };
  weather: WeatherDescription[];
}

export interface Forecast {
  city: {
    /** Deslocamento do fuso da cidade em relação ao UTC, em segundos. */
    timezone: number;
  };
  list: ForecastSlot[];
}

export interface DailyForecast {
  /** Data local da cidade, no formato AAAA-MM-DD. */
  date: string;
  min: number;
  max: number;
  icon: string;
  description: string;
}
