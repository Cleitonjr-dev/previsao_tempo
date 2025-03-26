import { createContext, useState, useEffect } from 'react';

export const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [backgroundColor, setBackgroundColor] = useState('linear-gradient(to right, #00b4db, #0083b0)'); // Default color
  const [isRaining, setIsRaining] = useState(false);

  const updateBackgroundColor = (description) => {
    setIsRaining(false);

    switch (description.toLowerCase()) {
      case 'céu limpo':
      case 'clear sky':
        setBackgroundColor('linear-gradient(to right, #00b4db, #0083b0)');
        break;
      case 'nublado':
      //case 'chuva':
      case 'rain':
        setBackgroundColor('linear-gradient(to right, #4c669f, #3b5998)');
        setIsRaining(true);
        break;
      default:
        setBackgroundColor('linear-gradient(to right, #00b4db, #0083b0)');
    }
  };

  useEffect(() => {
    document.body.style.background = backgroundColor;
  }, [backgroundColor]);

  return (
    <WeatherContext.Provider value={{ backgroundColor, updateBackgroundColor, isRaining }}>
      {children}
    </WeatherContext.Provider>
  );
};
