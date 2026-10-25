import { useNavigate } from 'react-router-dom';

export const useUnsubscribeHeader = () => {
    const navigate = useNavigate();
    const goToHome = () => navigate('/');
    return {
        goToHome,
    };
};