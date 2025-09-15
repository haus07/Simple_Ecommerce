import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
  withCredentials: true, // gửi cookie refresh token
});

// instance riêng để refresh token, không bị interceptor can thiệp
const refreshApi = axios.create({
  baseURL: 'http://localhost:3000',
  timeout: 5000,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error, token: string | null = null) => {
  failedQueue.forEach(p => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

export const setupInterceptors = (authContext: { logout: () => void }) => {
  const { logout } = authContext;

  api.interceptors.response.use(
    res => res,
    async error => {
      const originalRequest = error.config;

      if (!error.response) return Promise.reject(error);

      // Nếu là request refresh → không can thiệp
      if (originalRequest.url.includes('/refresh')) return Promise.reject(error);

      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        // Nếu đang refresh thì push request vào queue
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          }).then(token => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          }).catch(err => Promise.reject(err));
        }

        isRefreshing = true;

        try {
          // gọi refresh bằng refreshApi
          const response = await refreshApi.post('/api/v1/auth/refresh');
          const accessToken = response.data.accessToken;

          // lưu token và update header
          localStorage.setItem('access_Token', accessToken);
          api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;

          // xử lý lại các request trong queue
          processQueue(null, accessToken);

          // retry request gốc
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        } catch (err) {
          processQueue(err, null);
          logout();
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};

export default api;
