import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const LocationContext = createContext(null);

// Default fallback: Noida Sector 18
const NOIDA_DEFAULT = { lat: 28.5355, lng: 77.391 };

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLocation(NOIDA_DEFAULT);
      return;
    }

    setLocationLoading(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLoading(false);
      },
      (err) => {
        setLocationError(err.message);
        setLocation(NOIDA_DEFAULT);
        setLocationLoading(false);
      },
      { timeout: 8000, maximumAge: 5 * 60 * 1000 }
    );
  }, []);

  const value = useMemo(
    () => ({ location, locationError, locationLoading, requestLocation }),
    [location, locationError, locationLoading, requestLocation]
  );

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
