import axios from 'axios';

const axiosClient = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`,
});

axiosClient.interceptors.request.use((config) => {
  // CORRECTION : Utilisez 'ACCESS_TOKEN' (comme dans votre Context)
  const token = localStorage.getItem('ACCESS_TOKEN'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // CORRECTION : Supprimez les deux pour être sûr
      localStorage.removeItem('ACCESS_TOKEN');
      localStorage.removeItem('USER');
      window.location.href = '/login';
    }
    throw error;
  }
);

export default axiosClient;