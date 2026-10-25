import { useCreateShipmentContext } from "../../../../../context/CreateShipmentContext";
import { CalculateShipmentWeights } from "../../../../../utils";

export const usePackageInfoCard = () => {
  const { state } = useCreateShipmentContext();
  
  const firstPackage = state.packages[0];

  const calculateValue = (value?: string | number) => 
    value && value.toString().trim() !== "" ? value : null;

  if (!firstPackage) {
    return {
      dimensions: "No especificado",
      weight: "No especificado",
      productType: "No especificado",
      totalPackages: 0
    };
  }

  const { quotedWeight } = CalculateShipmentWeights({
    weight: firstPackage.weight,
    length: firstPackage.length,
    height: firstPackage.height,
    width: firstPackage.width
  });

  const dimensionsStr = 
    calculateValue(firstPackage.length) && calculateValue(firstPackage.width) && calculateValue(firstPackage.height)
      ? `${firstPackage.length}×${firstPackage.width}×${firstPackage.height} cm`
      : "Dimensiones no especificadas";

  const productTypeStr = 
    firstPackage.productTypeCode 
      ? `${firstPackage.productTypeCode} - ${firstPackage.productTypeDescription}`
      : "Tipo de producto no especificado";

  return {
    dimensions: dimensionsStr,
    weight: quotedWeight > 0 ? `${quotedWeight} kg` : "Peso no especificado",
    productType: productTypeStr,
    totalPackages: state.packages.length
  };
};