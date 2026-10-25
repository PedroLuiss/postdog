export interface ResendEmailFormProps {
  email: string;
  onEmailChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
  loading?: boolean;
  error?: string;
}