import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://your-promoverse-domain.com/api', // Replace with your actual deployed web API domain
  withCredentials: true, // This helps include auth cookies when needed
});
