import { createContext, useState, useEffect } from 'react';

export const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [backgroundColor, setBackgroundColor] = useState('linear-gradient(to right, #00b4db, #0083b0)'); // Default color
  const [isRaining, setIsRaining] = useState(false);
  const [isSnowing, setIsSnowing] = useState(false);
  const [isClouding, setIsClouding] = useState(false);

  const updateBackgroundColor = (description) => {
    setIsRaining(false);
    setIsSnowing(false);
    setIsClouding(false);

    const lowerCaseDescription = description.toLowerCase();

    if (lowerCaseDescription.includes('chuva') || lowerCaseDescription.includes('rain')) {
      setBackgroundColor('linear-gradient(to right, #4c669f, #3b5998)');
      setIsRaining(true);
    } else if (lowerCaseDescription.includes('neve') || lowerCaseDescription.includes('snow')) {
      setBackgroundColor('linear-gradient(to right, #2d91c2 0%, #1e528e )');
      setIsSnowing(true);
    } else if (lowerCaseDescription.includes('nuve') || lowerCaseDescription.includes('cloud')) {
      setBackgroundColor('linear-gradient(to right, #2d91c2 0%, #1e528e )');
      setIsClouding(true);
    } else if (lowerCaseDescription.includes('céu limpo') || lowerCaseDescription.includes('clear sky')) {
      setBackgroundColor('linear-gradient(to right, #00b4db, #0083b0)');
    } else {
      setBackgroundColor('linear-gradient(to right, #00b4db, #0083b0)');
    }
  };

  useEffect(() => {
    document.body.style.background = backgroundColor;
  }, [backgroundColor]);

  return (
    <WeatherContext.Provider value={{ backgroundColor, updateBackgroundColor, isRaining, isSnowing, isClouding }}>
      {children}
    </WeatherContext.Provider>
  );
};
