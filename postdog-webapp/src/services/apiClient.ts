
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { LoginUserData } from '../types';
import { clearStorage } from '../utils/storage.utils';
import { isTokenExpired } from '../utils';


const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3005/';


const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const storedData = localStorage.getItem('user');
    const user: LoginUserData | null = storedData ? JSON.parse(storedData) : null;
    if (user?.access_token && !isTokenExpired(user.access_token)) {
      config.headers.Authorization = `Bearer ${user.access_token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);


apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401) {
      if (error.response?.data?.message === 'Unauthorized' || originalRequest._retry) {
        clearStorage();
        window.location.href = '/login';
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      const storedData = localStorage.getItem('user');
      const user: LoginUserData | null = storedData ? JSON.parse(storedData) : null;

      if (user?.access_token) {
        try {
          const refreshResponse = await axios.post(`${API_BASE_URL}auth/refresh`, {
            refreshToken: user.access_token,
          });

          const newAccessToken = refreshResponse.data.access_token;
          const updatedUser = { ...user, access_token: newAccessToken };
          localStorage.setItem('user', JSON.stringify(updatedUser));

          apiClient.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          return apiClient(originalRequest);
        } catch (refreshError) {
          clearStorage();
          window.location.href = '/login';
          console.error('No se pudo renovar el token. Redirigiendo al login.');
        }
      }
    }

    return Promise.reject(error);
  }
);


// Función auxiliar para extraer los datos de la respuesta
const responseBody = <T>(response: AxiosResponse<T>) => response.data;


export const HttpService = {
  /**
   * Realiza una petición GET.
   * @template T - El tipo de dato esperado en la respuesta.
   * @param path - La ruta del endpoint (ej. '/users').
   * @returns Una promesa que resuelve con los datos de la respuesta.
   */
  get: <T>(path: string) =>
    apiClient.get<T>(path).then(responseBody),

  /**
   * Realiza una petición POST.
   * @template T - El tipo de dato esperado en la respuesta.
   * @template U - El tipo de dato del cuerpo de la petición.
   * @param path - La ruta del endpoint.
   * @param body - El cuerpo de la petición.
   * @returns Una promesa que resuelve con los datos de la respuesta.
   */
  post: <T, U>(path: string, body: U) =>
    apiClient.post<T>(path, body).then(responseBody),

  /**
   * Realiza una petición PUT.
   * @template T - El tipo de dato esperado en la respuesta.
   * @template U - El tipo de dato del cuerpo de la petición.
   * @param path - La ruta del endpoint (ej. '/users/1').
   * @param body - El cuerpo de la petición.
   * @returns Una promesa que resuelve con los datos de la respuesta.
   */
  put: <T, U>(path: string, body: U) =>
    apiClient.put<T>(path, body).then(responseBody),

  /**
   * Realiza una petición DELETE.
   * @template T - El tipo de dato esperado en la respuesta.
   * @param path - La ruta del endpoint (ej. '/users/1').
   * @returns Una promesa que resuelve con los datos de la respuesta.
   */
  delete: <T>(path: string) =>
    apiClient.delete<T>(path).then(responseBody),

  /**
   * Realiza una petición PATCH.
   * @template T - El tipo de dato esperado en la respuesta.
   * @template U - El tipo de dato del cuerpo de la petición.
   * @param path - La ruta del endpoint.
   * @param body - El cuerpo de la petición.
   * @returns Una promesa que resuelve con los datos de la respuesta.
   */
  patch: <T, U>(path: string, body: U) =>
    apiClient.patch<T>(path, body).then(responseBody),

  /**
 * Realiza una petición POST para subir archivos.
 * @template T - El tipo de dato esperado en la respuesta.
 * @param path - La ruta del endpoint.
 * @param formData - Instancia de FormData con los archivos.
 * @returns Una promesa que resuelve con los datos de la respuesta.
 */
  upload: <T>(path: string, formData: FormData) =>
    apiClient.post<T>(path, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(responseBody),

  /**
 * Realiza una petición PATCH para subir archivos.
 * @template T - El tipo de dato esperado en la respuesta.
 * @param path - La ruta del endpoint.
 * @param formData - Instancia de FormData con los archivos.
 * @returns Una promesa que resuelve con los datos de la respuesta.
 */
  patchUpload: <T>(path: string, formData: FormData) =>
    apiClient.patch<T>(path, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }).then(responseBody),

  /**
 * Realiza una petición GET para obtener un blob (archivo).
 * @param path - La ruta del endpoint.
 * @returns Una promesa que resuelve con el blob de la respuesta.
 */
  getBlob: (path: string) =>
    apiClient.get(path, { responseType: 'blob' }).then(responseBody),

  /**
 * Realiza una petición POST para descargar archivos.
 * @param path - La ruta del endpoint.
 * @param body - El cuerpo de la petición.
 * @returns Una promesa que resuelve con la respuesta de axios (incluyendo el blob).
 */
  download: <U>(path: string, body: U) =>
    apiClient.post(path, body, {
      responseType: 'blob',
    }),
};