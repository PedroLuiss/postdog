import { HttpService } from './apiClient';

// Define or import RegisterData and RegisterResponse types
export interface RegisterData {
  email: string;
  password: string;
  // Add other fields as required by your registration form
}

export interface UserProfile {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  plan?: string;
  tier?: string;
  [key: string]: any;
}

export interface RegisterResponse {
  token: string;
  user: UserProfile;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserProfile;
}

export interface RequestPasswordResetResponse {
  success: boolean;
  message: string;
  // Add other fields as returned by your backend
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  // Add other fields as returned by your backend
}

export interface AuthServiceType {
  register: (data: RegisterData) => Promise<RegisterResponse>;
  login: (credentials: LoginCredentials) => Promise<LoginResponse>;
  loginWithGoogle: (token: string) => Promise<LoginResponse>;
  requestPasswordReset: (email: string) => Promise<RequestPasswordResetResponse>;
  resetPassword: (data: { token: string; newPassword: string }) => Promise<ResetPasswordResponse>;
  getMe: () => Promise<UserProfile>;
  getProfile: () => Promise<UserProfile>;
}


const AuthService: AuthServiceType = {
  /**
   * Registra un nuevo usuario.
   *
   * @param {Object} data - Objeto con los datos del usuario a registrar.
   * @returns {Promise<Object>} - Respuesta del servidor.
   */
  register: async (data: RegisterData): Promise<RegisterResponse> => {
    try {
      const response = await HttpService.post<RegisterResponse, RegisterData>('/auth/register', data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
  * Inicia sesión con las credenciales del usuario.
  *
  * @param {Object} credentials - Objeto con las credenciales (e.g., { email, password }).
  * @returns {Promise<Object>} - Respuesta del servidor.
  */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await HttpService.post<LoginResponse, LoginCredentials>('/auth/login', credentials);
      return response;
    } catch (error) {
      throw error;
    }
  },


  /**
   * Autentica al usuario con Google y envía el token al backend.
   *
   * @returns {Promise<Object>} - Respuesta del servidor con access_token y datos del usuario.
   */
  loginWithGoogle: async (token: string): Promise<LoginResponse> => {
    try {
      const response = await HttpService.post<LoginResponse, { idToken: string }>('/auth/firebase', { idToken: token });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Solicita el reinicio de contraseña a través del email.
   *
   * @param {string} email - Email del usuario para solicitar el reinicio.
   * @returns {Promise<Object>} - Respuesta del servidor.
   */
  requestPasswordReset: async (email: string): Promise<RequestPasswordResetResponse> => {
    try {
      const response = await HttpService.post<RequestPasswordResetResponse, { email: string }>('/auth/request-password-reset', { email });
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
  * Restablece la contraseña utilizando un token de validación.
  *
  * @param {Object} data - Objeto que contiene { token, newPassword }.
  * @returns {Promise<Object>} - Respuesta del servidor.
  */
  resetPassword: async (data: { token: string; newPassword: string }): Promise<ResetPasswordResponse> => {
    try {
      const response = await HttpService.post<ResetPasswordResponse, any>('/auth/reset-password', data);
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene los datos del usuario autenticado.
   *
   * @returns {Promise<Object>} - Datos del usuario.
   */
  getMe: async (): Promise<UserProfile> => {
    try {
      const response = await HttpService.get<UserProfile>('/auth/me');
      return response;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Obtiene el perfil del usuario.
   *
   * @returns {Promise<Object>} - Datos del perfil.
   */
  getProfile: async (): Promise<UserProfile> => {
    try {
      const response = await HttpService.get<UserProfile>('/profile');
      return response;
    } catch (error) {
      throw error;
    }
  },
};

export default AuthService;
