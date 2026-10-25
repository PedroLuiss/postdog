export interface UserModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmitSuccess?: (user: any) => void;
}

export interface UserFormData {
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    password?: string;
    role_id: string;
}
