import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const formatNotificationTime = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "d-MMM, p", { locale: es }).toLowerCase();
    } catch {
      return dateString;
    }
  };