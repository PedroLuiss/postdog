import { useEffect, useCallback, useRef } from 'react';
import { useCreateShipmentContext } from '../../../context/CreateShipmentContext';
import { QuoteFormData } from '../../../types';
import AddressServices from '../../../services/AddressService';
import { isAddressComplete, arePackagesComplete, isQuotePackageComplete, isAddresseeCompleteForOrder } from '../utils';


export const useCreateShipmentDrawer = (initialQuoteData?: QuoteFormData) => {
    const { 
        state,
        clearRemitter, 
        clearAddressee, 
        updateRemitter,
        updateAddressee,
        updatePackage,
        isModalCreateShipmentOpen,
        closeModalCreateShipment,
        isRemitterEditing,
        setIsRemitterEditing,
        isAddresseeEditing,
        setIsAddresseeEditing,
        isPackageEditing,
        setIsPackageEditing
    } = useCreateShipmentContext();

    const prevOpenRef = useRef(false);

    useEffect(() => {
        if (isModalCreateShipmentOpen && !prevOpenRef.current) {
            if (state.isDuplicating) {
                setIsRemitterEditing(false);
                setIsAddresseeEditing(false);
                setIsPackageEditing(false);
            } else {
                const remitterOk = isAddressComplete(state.remitter);
                let addresseeOk = isAddressComplete(state.addressee);
                
                const packageOk = initialQuoteData 
                    ? (isQuotePackageComplete(initialQuoteData) || !!initialQuoteData.savedPackageId)
                    : arePackagesComplete(state.packages);

                if (state.shippingType === 'from_order') {
                    addresseeOk = isAddresseeCompleteForOrder(state.addressee);
                }

                setIsRemitterEditing(!remitterOk);
                setIsAddresseeEditing(!addresseeOk);
                setIsPackageEditing(!packageOk);
            }
        }
        prevOpenRef.current = isModalCreateShipmentOpen;
    }, [isModalCreateShipmentOpen, initialQuoteData, state.isDuplicating, state.shippingType, state.remitter, state.addressee, state.packages, setIsRemitterEditing, setIsAddresseeEditing, setIsPackageEditing]);

    const hasPopulatedRef = useRef(false);

    useEffect(() => {
        if (!isModalCreateShipmentOpen) {
            hasPopulatedRef.current = false;
            return;
        }

        if (hasPopulatedRef.current) return;

        const fetchAndPopulateZip = async (zip: string, updateFn: (data: any) => void) => {
            if (zip && zip.length === 5) {
                try {
                    const data = await AddressServices.getZipCodeData(zip);
                    if (data && data.length > 0) {
                        const match = data[0];
                        updateFn({
                            zipCode: zip,
                            state: match.state,
                            city: match.city,
                            country: match.country || 'MX'
                        });
                    }
                } catch (error) {
                    console.error("Error al poblar ZIP:", error);
                    updateFn({ zipCode: zip });
                }
            }
        };

        if (initialQuoteData) {
            hasPopulatedRef.current = true;
            fetchAndPopulateZip(initialQuoteData.originPostalCode, updateRemitter);
            fetchAndPopulateZip(initialQuoteData.destinationPostalCode, updateAddressee);

            if (state.packages.length > 0) {
                const firstPkgId = state.packages[0].id;
                updatePackage(firstPkgId, {
                    length: String(initialQuoteData.length),
                    width: String(initialQuoteData.width),
                    height: String(initialQuoteData.height),
                    weight: String(initialQuoteData.weight),
                    productTypeCode: initialQuoteData.productTypeCode,
                    productTypeDescription: initialQuoteData.productTypeDescription,
                    savedPackageId: initialQuoteData.savedPackageId,
                });
            }
        } 
        else if (state.shippingType === 'from_order') {
            hasPopulatedRef.current = true;
            if (state.addressee.zipCode?.length === 5 && !state.addressee.city) {
                fetchAndPopulateZip(state.addressee.zipCode, updateAddressee);
            }
            if (state.remitter.zipCode?.length === 5 && !state.remitter.city) {
                fetchAndPopulateZip(state.remitter.zipCode, updateRemitter);
            }
        }
    }, [
        isModalCreateShipmentOpen, 
        initialQuoteData, 
        state.shippingType, 
        state.packages, 
        state.addressee.zipCode, 
        state.addressee.city, 
        state.remitter.zipCode, 
        state.remitter.city, 
        updateRemitter, 
        updateAddressee, 
        updatePackage
    ]);


    const handleRemitterAddressSelected = useCallback(() => {
        setIsRemitterEditing(false);
    }, [setIsRemitterEditing]);

    const handleAddresseeAddressSelected = useCallback(() => {
        setIsAddresseeEditing(false);
    }, [setIsAddresseeEditing]);

    const handlePackageSelected = useCallback(() => {
        setIsPackageEditing(false);
    }, [setIsPackageEditing]);

    return {
        state,
        isModalCreateShipmentOpen,
        closeModalCreateShipment,
        clearRemitter,
        clearAddressee,
        isRemitterEditing,
        setIsRemitterEditing,
        isAddresseeEditing,
        setIsAddresseeEditing,
        isPackageEditing,
        setIsPackageEditing,
        handleRemitterAddressSelected,
        handleAddresseeAddressSelected,
        handlePackageSelected
    };
};