import { ScheduledPickup } from '../types';

export const CARRIER_LOGOS: Record<string, string> = {
    'dhl': 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/89a5f8809_dhllogo.png',
    'estafeta': 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/dca8e03aa_estagetalogo.png'
};

export const CARRIER_NAMES: Record<string, string> = {
    'dhl': 'DHL',
    'estafeta': 'Estafeta'
};

export const formatPickupDate = (dateString: string): string => {
    if (!dateString) return '';
    
    if (dateString === 'Hoy' || dateString === 'Mañana') return dateString;

    const date = new Date(dateString + 'T00:00:00');
    if (isNaN(date.getTime())) return dateString;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    if (checkDate.getTime() === today.getTime()) return 'Hoy';
    if (checkDate.getTime() === tomorrow.getTime()) return 'Mañana';

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
};

export const enrichPickupData = (pickup: ScheduledPickup): ScheduledPickup => {
    const carrierKey = pickup.carrier.toLowerCase();

    return {
        ...pickup,
        carrier: CARRIER_NAMES[carrierKey] || pickup.carrier,
        carrierLogoUrl: pickup.carrierLogoUrl || CARRIER_LOGOS[carrierKey]
    };
};
