
export interface RecoveryFormProps {
    email: string;
    setEmail: (email: string) => void;
    loading: boolean;
    errors: { email: string };
    handleSubmit: (e: React.FormEvent) => void;
    navigate: (path: string) => void;
}