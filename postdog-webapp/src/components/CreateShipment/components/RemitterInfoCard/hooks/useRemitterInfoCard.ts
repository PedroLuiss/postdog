import { useCreateShipmentContext } from "../../../../../context/CreateShipmentContext";

export const useRemitterInfoCard = () => {
  const { state } = useCreateShipmentContext();
  const { remitter } = state;

  const displayValue = (value?: string) => 
    value && value.trim() !== "" ? value : "No especificado";

  const getFullAddress = () => {
    const { street, internalNumber, colony, city, state: resState, zipCode } = remitter;
    
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
    fullName: displayValue(remitter.fullName),
    phone: displayValue(remitter.phone),
    address: getFullAddress(),
    rfc: remitter.rfc,
  };
};