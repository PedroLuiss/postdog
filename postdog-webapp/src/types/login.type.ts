export interface LoginUserData {
    access_token: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}