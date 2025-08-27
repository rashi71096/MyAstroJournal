import { useEffect } from 'react';
import { useAppContext } from '../store/AppContext';
import { horoscopeApi } from '../services/horoscopeApi';

export const useHoroscope = () => {
  const { state, setHoroscopeLoading, setHoroscopeData, setError } = useAppContext();

  const fetchHoroscope = async (sign) => {
    try {
      setHoroscopeLoading(true);
      setError(null);
      
      const horoscopeData = await horoscopeApi.getDailyHoroscope(sign);
      
      if (horoscopeData) {
        setHoroscopeData(horoscopeData);
      } else {
        setError('Failed to fetch horoscope data');
      }
    } catch (error) {
      console.error('Error in useHoroscope:', error);
      setError('An error occurred while fetching horoscope');
    } finally {
      setHoroscopeLoading(false);
    }
  };

  // Auto-fetch horoscope when zodiac sign changes
  useEffect(() => {
    if (state.selectedZodiacSign) {
      fetchHoroscope(state.selectedZodiacSign);
    }
  }, [state.selectedZodiacSign]);

  return {
    horoscopeData: state.horoscopeData,
    isLoading: state.isLoadingHoroscope,
    error: state.error,
    refetch: () => fetchHoroscope(state.selectedZodiacSign),
  };
};
