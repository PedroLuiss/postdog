import { useCreateShipmentContext } from "../../../../../context/CreateShipmentContext";

export const useAddresseeInfoCard = () => {
  const { state } = useCreateShipmentContext();
  const { addressee } = state;

  const displayValue = (value?: string) => 
    value && value.trim() !== "" ? value : "No especificado";

  const getFullAddress = () => {
    const { street, internalNumber, colony, city, state: resState, zipCode } = addressee;
    
    const parts = [
      street,
      internalNumber ? `Int. ${internalNumber}` : null,
      colony,
      city,
      resState,
      zipCode ? `CP ${zipCode}` : null
    ].filter(Boolean);

    return displayValue(parts.length > 0 ? parts.join(', ') : "");
  };

  return {
    fullName: displayValue(addressee.fullName),
    phone: addressee.phone ? `+52 ${addressee.phone}` : "No especificado",
    address: getFullAddress(),
  };
};