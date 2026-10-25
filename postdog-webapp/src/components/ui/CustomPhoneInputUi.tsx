import PhoneInput from 'react-phone-input-2';
import { PhoneInputProps } from 'react-phone-input-2';

export type CustomPhoneInputProps = PhoneInputProps;
export const CustomPhoneInputUi = ({
  inputProps = {
    id: 'register-phone',
    name: 'phone',
    required: true,
    'aria-required': 'true',
  },
  country = 'mx',
  inputClass = 'remitter-form__input',
  inputStyle = {
    width: '100%',
    height: '40px',
    fontSize: '16px',
    borderRadius: '4px',
    border: '1px solid #0A0A0A',
    padding: '10px 50px',
  },
  buttonStyle = {
    borderRadius: '4px 0 0 4px',
  },
  searchPlaceholder = 'Buscar',
  specialLabel = '',
  masks = { mx: '... ... .. ..' },
  enableSearch = true,
  ...rest
}: CustomPhoneInputProps) => {
  return (
    <PhoneInput
      inputProps={inputProps}
      country={country}
      inputClass={inputClass}
      inputStyle={inputStyle}
      buttonStyle={buttonStyle}
      searchPlaceholder={searchPlaceholder}
      specialLabel={specialLabel}
      masks={masks}
      enableSearch={enableSearch}
      {...rest}
    />
  );
};
