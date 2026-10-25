type FormatStyle =
  | "dd/MM/yyyy h:mm a"
  | "dd-MM-yyyy"
  | "yyyy/MM/dd"
  | "MMMM dd, yyyy"
  | "dd/MM/yyyy"
  | "full";

const monthNames = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
];

export const FormattedDateUtils = (
  dateString: string,
  formatStyle: FormatStyle = "dd/MM/yyyy h:mm a"
): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Fecha inválida";

  const pad = (n: number) => n.toString().padStart(2, "0");
  const day = pad(date.getDate());
  const month = pad(date.getMonth() + 1);
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = pad(date.getMinutes());
  const ampm = hours >= 12 ? "pm" : "am";
  const hour12 = pad(hours % 12 === 0 ? 12 : hours % 12);
  const fullMonth = monthNames[date.getMonth()];

  switch (formatStyle) {
    case "dd/MM/yyyy h:mm a":
      return `${day}/${month}/${year} ${hour12}:${minutes} ${ampm}`;
    case "dd-MM-yyyy":
      return `${day}-${month}-${year}`;
    case "yyyy/MM/dd":
      return `${year}/${month}/${day}`;
    case "MMMM dd, yyyy":
      return `${fullMonth} ${day}, ${year}`;
    case "dd/MM/yyyy":
      return `${day}/${month}/${year}`;
    case "full":
      return `${day} de ${fullMonth} de ${year}, ${hour12}:${minutes} ${ampm}`;
    default:
      return `${day}/${month}/${year}${hour12}:${minutes} ${ampm}`;
  }
};

export const formattedDateMex = (dateString: string) => {
    const date = new Date(dateString).toLocaleString('es-MX', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
  })
  return date;
}

export const formatDateNotificationGlobal = (dateStr: string) => {
      try {
          return new Date(dateStr).toLocaleString('es-ES', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
          });
      } catch (e) {
          return dateStr;
      }
  };
