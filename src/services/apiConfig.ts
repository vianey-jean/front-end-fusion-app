
import axios from 'axios';

const AUTH_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API = axios.create({
  baseURL: `${AUTH_BASE_URL}/api`,
  timeout: 30000,
});

// Variables pour le throttling des requêtes
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 seconde minimum entre les requêtes

API.interceptors.request.use(
  (config) => {
    // Throttling simple pour éviter trop de requêtes
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      const delay = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      return new Promise(resolve => {
        setTimeout(() => {
          lastRequestTime = Date.now();
          resolve(config);
        }, delay);
      });
    }
    
    lastRequestTime = now;
    
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    if (config.method === 'get') {
      config.params = {
        ...config.params,
        _t: Date.now(),
      };
    }

    // Réduire les logs en production
    if (process.env.NODE_ENV === 'development') {
      console.log(`${config.method?.toUpperCase()} Request to ${config.url}`, 
        config.method === 'post' || config.method === 'put' 
          ? JSON.stringify(config.data)
          : config.params || {});
    }

    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

API.interceptors.response.use(
  response => {
    // Réduire les logs en production
    if (process.env.NODE_ENV === 'development') {
      console.log(`Response from ${response.config.url}:`, response.data);
    }
    return response;
  },
  error => {
    console.error("API Error:", error.response || error);
    
    // Gestion spéciale pour les erreurs 429
    if (error.response && error.response.status === 429) {
      console.warn("Rate limit atteint. Ralentissement des requêtes recommandé.");
      // Augmenter l'intervalle minimum entre les requêtes
      lastRequestTime = Date.now() + 5000; // Ajouter 5 secondes de délai
      return Promise.reject(error);
    }
    
    if (error.response && error.response.status === 401 && 
        !error.config.url.includes('/auth/login') && 
        !error.config.url.includes('/auth/verify-token')) {
      console.log("Session expirée, redirection vers la page de connexion...");
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);
