import AsyncStorage from '@react-native-async-storage/async-storage';
import { CLIENT_ID, CLIENT_SECRET } from '@env';

const BASE_URL = 'https://api.prokerala.com';

let token = null;

const getToken = async () => {
  if (token) return token;

  const response = await fetch(`${BASE_URL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
  });

  const data = await response.json();
  token = data.access_token;
  return token;
};

const getDailyHoroscope = async (sign) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const cacheKey = `horoscope_${sign.toLowerCase()}_${today}`;
    
    // Check cache first
    const cached = await AsyncStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);

    // Get token and make API call
    const authToken = await getToken();
    const datetime = new Date().toISOString().replace('Z', '+05:30');
    
    const params = new URLSearchParams({
      datetime: datetime,
      sign: sign.toLowerCase()
    });
    
    const response = await fetch(`${BASE_URL}/v2/horoscope/daily?${params}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
    });

    if (!response.ok) {
      return {
        sign: sign,
        date: today,
        horoscope: `Unable to fetch horoscope for ${sign} today. Please try again later.`,
      };
    }

    const data = await response.json();
    const horoscopeData = {
      sign: sign,
      date: today,
      horoscope: data.data?.daily_prediction?.prediction || 'No horoscope available for today.',
    };

    // Cache the result
    await AsyncStorage.setItem(cacheKey, JSON.stringify(horoscopeData));
    return horoscopeData;
    
  } catch (error) {
    console.error('Error fetching horoscope:', error);
    return null;
  }
};

export const horoscopeApi = {
  getDailyHoroscope,
};
