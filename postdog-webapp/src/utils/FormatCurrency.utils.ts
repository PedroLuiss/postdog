
export type CurrencyCode =
  | 'MXN' // Mexican Peso
  | 'USD' // US Dollar
  | 'EUR' // Euro
  | 'COP' // Colombian Peso
  | 'BRL' // Brazilian Real
  | 'ARS'; // Argentine Peso


export type LocaleCode =
  | 'es-MX' // Español (México)
  | 'en-US' // Inglés (Estados Unidos)
  | 'es-CO' // Español (Colombia)
  | 'pt-BR' // Portugués (Brasil)
  | 'es-AR'; // Español (Argentina)


export const formatCurrencyUtils = (
  value: number,
  locale: LocaleCode = 'es-MX',
  currency: CurrencyCode = 'MXN'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);
};

export const formatCurrency = (amount: number) => {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

