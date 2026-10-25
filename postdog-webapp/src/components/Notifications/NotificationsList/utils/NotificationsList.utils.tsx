import { Package, DollarSign, Settings, Info, NotepadText } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { NotificationType } from '../../../../types/notificationsPush.type';

export const getIcon = (type: NotificationType) => {
    switch (type.toUpperCase()) {
        case 'PLAN': return <NotepadText size={20} />;
        case 'SHIPMENT': return <Package size={20} />;
        case 'BILLING': return <DollarSign size={20} />;
        case 'SYSTEM': return <Settings size={20} />;
        default: return <Info size={20} />;
    }
  };

export const formatNotificationTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "d 'de' MMMM 'de' yyyy, p", { locale: es });
    } catch {
      return dateString;
    }
  };