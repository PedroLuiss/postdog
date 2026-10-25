export interface AuthErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}