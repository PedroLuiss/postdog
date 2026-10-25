import { AddressFormData, Package, ShippingOption } from "../types";

interface ShipmentUpdateData {
  addresses: { 
    remitterData: AddressFormData;
    addresseeData: AddressFormData;
};
  packages: Package[]; 
  selectedCourier: ShippingOption; 
  pawSafe: { active: boolean; value: string };
}

export const updateShipmentServices = async (shipmentId: string, data: ShipmentUpdateData): Promise<any> => {
  await new Promise(resolve => setTimeout(resolve, 1500));

  if (!data.selectedCourier) {
    throw new Error('No se ha seleccionado una paquetería.');
  }

  return { success: true, message: 'Envío actualizado correctamente.' };
};

