// src/services/AuthService.js
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const AuthService = {
  /**
   * Registra un nuevo usuario.
   *
   * @param {Object} data - Objeto con los datos del usuario a registrar.
   * @returns {Promise<Object>} - Respuesta del servidor.
   */
  register: async (data) => {
    const config = {
      method: 'post',
      url: `${API_BASE_URL}/auth/register`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      // Puedes mapear el error a un formato más amigable si fuera necesario.
      throw error;
    }
  },

  /**
  * Inicia sesión con las credenciales del usuario.
  *
  * @param {Object} credentials - Objeto con las credenciales (e.g., { email, password }).
  * @returns {Promise<Object>} - Respuesta del servidor.
  */
  login: async (credentials) => {
    const config = {
      method: 'post',
      url: `${API_BASE_URL}/auth/login`,
      headers: {
        'Content-Type': 'application/json'
      },
      data: credentials,
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },


  /**
   * Autentica al usuario con Google y envía el token al backend.
   *
   * @returns {Promise<Object>} - Respuesta del servidor con access_token y datos del usuario.
   */
  loginWithGoogle: async (token) => {
    try {
      const config = {
        method: "post",
        url: `${API_BASE_URL}/auth/firebase`,
        headers: {
          "Content-Type": "application/json",
        },
        data: { idToken: token },
      };

      const response = await axios.request(config);
      return response.data;
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
  requestPasswordReset: async (email) => {
    const config = {
      method: 'post',
      url: `${API_BASE_URL}/auth/request-password-reset`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: { email },
      // También podrías usar: data: JSON.stringify({ email }),
    };

    try {
      const response = await axios.request(config);
      return response.data;
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
  resetPassword: async (data) => {
    const config = {
      method: 'post',
      url: `${API_BASE_URL}/auth/reset-password`,
      headers: { 'Content-Type': 'application/json' },
      data: data, // Puede ser { token, newPassword }
    };

    try {
      const response = await axios.request(config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

};

export default AuthService;
