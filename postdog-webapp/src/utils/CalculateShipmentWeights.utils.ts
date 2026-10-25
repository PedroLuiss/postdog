interface CalculateShipmentWeightsParams {
    weight: string | number;
    length: string | number;
    height: string | number;
    width: string | number;
}

export const CalculateShipmentWeights = ({
    weight,
    length,
    height,
    width
}: CalculateShipmentWeightsParams) => {
    const massWeight = Number(weight) || 0;
    
    const l = Number(length) || 0;
    const h = Number(height) || 0;
    const w = Number(width) || 0;
    
    const volumetricWeight = (l * h * w) / 5000;
    
    const safeVolumetricWeight = isNaN(volumetricWeight) ? 0 : volumetricWeight;
    
    const quotedWeight = Math.max(massWeight, safeVolumetricWeight);

    return {
        massWeight,
        volumetricWeight: safeVolumetricWeight,
        quotedWeight
    };
};
