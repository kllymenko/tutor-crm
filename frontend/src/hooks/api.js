import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
});

const handleTokenRefreshError = () => {
    localStorage.clear();
    window.location.href = '/';
};

api.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem('accessToken')?.trim();
        if (accessToken) {
            // Add 'Bearer ' prefix and ensure no whitespace
            config.headers.Authorization = `${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken')?.trim();
                const response = await api.post('/auth/refresh', {
                    refresh_token: refreshToken,
                });
                const { access_token, refresh_token, role } = response.data;
                localStorage.setItem('accessToken', access_token.trim());
                localStorage.setItem('refreshToken', refresh_token.trim());
                localStorage.setItem('role', role);
                // Retry the original request with the new token
                originalRequest.headers.Authorization = `${access_token.trim()}`;
                return api(originalRequest);
            } catch (err) {
                console.error('Error with refresh token:', err);
                handleTokenRefreshError();
            }
        }

        return Promise.reject(error);
    }
);

export default api;
