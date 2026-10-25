import { HttpService } from './apiClient';

export interface UnsubscribeResponse {
    success?: boolean;
    valid?: boolean;
    message: string;
}

export interface UnsubscribeServiceType {
    verifyToken: (email: string, token: string) => Promise<UnsubscribeResponse>;
    unsubscribe: (email: string, token: string) => Promise<UnsubscribeResponse>;
}

const UnsubscribeService: UnsubscribeServiceType = {
    /**
     * Verifica el token de desuscripción.
     * 
     * @param {string} email
     * @param {string} token
     * @returns {Promise<UnsubscribeResponse>}
     */
    verifyToken: async (email: string, token: string): Promise<UnsubscribeResponse> => {
        try {
            const response = await HttpService.get<UnsubscribeResponse>(`/mail/unsubscribe/verify?email=${email}&token=${token}`);
            return response;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Anula la suscripción de un usuario por su email y token.
     * 
     * @param {string} email
     * @param {string} token
     * @returns {Promise<UnsubscribeResponse>}
     */
    unsubscribe: async (email: string, token: string): Promise<UnsubscribeResponse> => {
        try {
            const response = await HttpService.post<UnsubscribeResponse, { email: string; token: string }>('/mail/unsubscribe', { email, token });
            return response;
        } catch (error) {
            throw error;
        }
    }
};

export default UnsubscribeService;
