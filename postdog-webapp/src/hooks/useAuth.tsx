// src/hooks/useAuth.js
import { useState, useCallback } from 'react';
import AuthService from '../services/AuthService';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

/**
 * Inicia sesión con las credenciales proporcionadas.
 *
 * @param {Object} credentials - Credenciales de login (e.g., { email, password }).
 * @returns {Promise<Object>} - Datos del usuario autenticado.
 */
interface LoginCredentials {
    email: string;
    password: string;
}

interface AuthUser {
    user: any;
    token: string;
}

interface AuthError {
    message: string;
    // Add other error fields as needed
}

/**
     * Registra un nuevo usuario.
     *
     * @param {Object} data - Datos para registro (e.g., { name, email, password }).
     * @param {string} token - Token API necesario para el registro.
     * @returns {Promise<Object>} - Datos del usuario registrado.
     */
interface RegisterData {
    first_name: string;
    last_name: string;
    email: string;
    phone_country_code: string;
    phone_number: string;
    password: string;
    accepted_terms: boolean;
}

interface ResetPasswordData {
    token: string;
    newPassword: string;
}

interface ResetPasswordResponse {
    success: boolean;
    message?: string;
}

const useAuth = () => {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<AuthError | null>(null);

    const login = useCallback(
        async (credentials: LoginCredentials): Promise<AuthUser> => {
            setLoading(true);
            setError(null);
            try {
                const authenticatedUser: AuthUser = await AuthService.login(credentials);
                setUser(authenticatedUser);
                return authenticatedUser;
            } catch (err: any) {
                setError(err as AuthError);
                throw err;
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }
        },
        []
    );

    /**
     * Autentica al usuario con Google y envía el token al backend.
     *
     * @returns {Promise<Object>} - Respuesta del servidor con access_token y datos del usuario.
     */
    const loginWithFirebase = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const idToken = await result.user.getIdToken();

            const authenticatedUser = await AuthService.loginWithGoogle(idToken);
            setUser(authenticatedUser);
            return authenticatedUser;
        } catch (err) {
            setError(err as AuthError);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const register = useCallback(
        async (data: RegisterData): Promise<AuthUser> => {
            setLoading(true);
            setError(null);
            try {
                const newUser: AuthUser = await AuthService.register(data);
                setUser(newUser);
                return newUser;
            } catch (err: any) {
                setError(err as AuthError);
                throw err;
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
            }
        },
        []
    );

    /**
   * Solicita el reinicio de contraseña al enviar el email.
   *
   * @param {string} email - Email del usuario para recuperar la contraseña.
   * @returns {Promise<Object>} - Respuesta del servidor.
   */
    const requestPasswordReset = useCallback(async (email: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await AuthService.requestPasswordReset(email);
            return response;
        } catch (err) {
            setError(err as AuthError);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    /**
   * Restablece la contraseña utilizando el token y la nueva contraseña.
   *
   * @param {Object} resetData - { token, newPassword }.
   * @returns {Promise<Object>} - Respuesta del servidor.
   */

    const resetPassword = useCallback(
        async (resetData: ResetPasswordData): Promise<ResetPasswordResponse> => {
            setLoading(true);
            setError(null);
            try {
                const response: ResetPasswordResponse = await AuthService.resetPassword(resetData);
                return response;
            } catch (err: any) {
                setError(err as AuthError);
                throw err;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    /**
     * Función de logout que limpia el estado del usuario.
     */
    const logout = useCallback(() => {
        setUser(null);
    }, []);

    return {
        user,
        loading,
        error,
        login,
        loginWithFirebase,
        register,
        requestPasswordReset,
        resetPassword,
        logout
    };
};

export default useAuth;
