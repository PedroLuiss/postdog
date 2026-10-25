export interface ResetFormProps {
    password: string;
    setPassword: (value: string) => void;
    confirmPassword: string;
    setConfirmPassword: (value: string) => void;
    showPassword: boolean;
    showConfirmPassword: boolean;
    errors: {
        password: string;
        confirmPassword: string;
    };
    setErrors: React.Dispatch<React.SetStateAction<{
        password: string;
        confirmPassword: string;
    }>>;
    loading: boolean;
    handleSubmit: (e: React.FormEvent) => void;
    toggleShowPassword: () => void;
    toggleShowConfirmPassword: () => void;
}