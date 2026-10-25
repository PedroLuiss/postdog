
export interface LoginFormProps {
    styles: any;
    email: string;
    setEmail: (value: string) => void;
    password: string;
    setPassword: (value: string) => void;
    showPassword: boolean;
    togglePasswordVisibility: () => void;
    errors: { email?: string; password?: string };
    loading: boolean;
    handleLogin: (e: React.FormEvent) => void;
    handleLoginFirebase: () => void;
    navigate: (path: string) => void;
}