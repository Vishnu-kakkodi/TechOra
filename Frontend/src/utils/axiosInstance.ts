
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const axiosInstance = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (cb: (token: string) => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = (newToken: string) => {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
};

export const useAxiosInterceptor = () => {
  const navigate = useNavigate();

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.code === 'TOKEN_EXPIRED'
      ) {
        if (!isRefreshing) {
          isRefreshing = true;
          try {
            const { data } = await axios.post(`${backendUrl}/api/auth/refresh-token`, {
              
          }, { withCredentials: true });
            const newAccessToken = data.accessToken;

            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;

            onRefreshed(newAccessToken);

            isRefreshing = false;
          } catch (refreshError) {
            isRefreshing = false;
            return Promise.reject(refreshError);
          }
        }

        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken: string) => {
            originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
            resolve(axiosInstance(originalRequest));
          });
        });
      }

      if (
        error.response?.status === 403 &&
        error.response?.data?.message === 'User account is not active'
      ) {
        navigate('/account-blocked', { replace: true });
      }

      return Promise.reject(error);
    }
  );
};

