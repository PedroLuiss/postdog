import { useEffect } from "react";
import { RateTier } from "../Type/PreferentialRatesModal.Type";
import { useAppContext } from "../../../context/AppContext";
import AuthService from "../../../services/AuthService";
import chihuahuaImg from "../../../assets/img/plans/Chiguagua.png";
import chihuahuaWhiteImg from "../../../assets/img/plans/ChiiguaguaWhiter.png";
import huskyImg from "../../../assets/img/plans/Husky.png";
import huskyWhiteImg from "../../../assets/img/plans/HuskyWhiter.png";
import pitbullImg from "../../../assets/img/plans/Pitbull.png";
import pitbullWhiteImg from "../../../assets/img/plans/PitbullWhiter.png";
import pugImg from "../../../assets/Logos/pug_red.png";
import pugWhiteImg from "../../../assets/Logos/pug_white.png";

export const usePreferentialRatesModal = (isOpen: boolean) => {
    const context = useAppContext();
    const { setUser } = context || {};
    const user = context?.user?.user || context?.user;
    const currentTierId = user?.plan;
    const isCurrentTier = (id: string) => String(currentTierId || '').toUpperCase() === id.toUpperCase();

    useEffect(() => {
        if (isOpen) {
            const checkPlanUpgrade = async () => {
                try {
                    const updatedUser = await AuthService.getProfile();
                    if (setUser && updatedUser) {
                        setUser((prev: any) => ({
                            ...prev,
                            user: updatedUser
                        }));
                        const storedData = localStorage.getItem('user');
                        if (storedData) {
                            const data = JSON.parse(storedData);
                            data.user = updatedUser;
                            localStorage.setItem('user', JSON.stringify(data));
                        }
                    }
                } catch (error) {
                    console.error('Error auto-detecting plan upgrade:', error);
                }
            };
            checkPlanUpgrade();
        }
    }, [isOpen, setUser]);

    const tiers: RateTier[] = [
        {
            id: 'chihuahua',
            name: 'Nivel Chihuahua',
            icon: chihuahuaImg,
            iconWhite: chihuahuaWhiteImg,
            benefits: [
                'Tarifas estándar al registrarte',
                'Acceso completo a la plataforma'
            ],
            footerText: 'Nivel base',
            isCurrent: isCurrentTier('chihuahua')
        },
        {
            id: 'pug',
            name: 'Nivel Pug',
            icon: pugImg,
            iconWhite: pugWhiteImg,
            benefits: [
                'Recarga desde $1.500 MXN',
                'Descuento preferencial en envíos',
                'Requiere: 3+ envíos mensuales'
            ],
            footerText: 'Ahorro recomendado',
            isCurrent: isCurrentTier('pug')
        },
        {
            id: 'husky',
            name: 'Nivel Husky',
            icon: huskyImg,
            iconWhite: huskyWhiteImg,
            benefits: [
                'Recarga desde $3.000 MXN',
                'Tarifas más competitivas',
                'Requiere: 6+ envíos mensuales'
            ],
            footerText: 'Mejor equilibrio',
            isCurrent: isCurrentTier('husky')
        },
        {
            id: 'pitbull',
            name: 'Nivel Pitbull',
            icon: pitbullImg,
            iconWhite: pitbullWhiteImg,
            benefits: [
                'Recarga desde $4.500 MXN',
                'Mejores tarifas disponibles',
                'Requiere: 15+ envíos mensuales'
            ],
            footerText: 'Máximo ahorro',
            isCurrent: isCurrentTier('pitbull')
        }
    ];

    const handleContactSales = () => {
        console.log('Contacting sales...');
        window.open('https://wa.me/message/YOUR_WHATSAPP_LINK', '_blank');
    };

    return {
        tiers,
        handleContactSales
    };
};
