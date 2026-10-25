import { useState, useRef, useEffect, useMemo } from 'react';
import { AddressOption } from '../types/addressSelectUis.type';
import AddressServices from '../../../../services/AddressService';
import { useNotification } from '../../../../context/NotificationContext';
import { ZipCodeResponse } from '../../../../types';

interface UseAddressSelectUiProps {
    value: string | number;
    savedAddresses: AddressOption[];
    savedAddressId?: string;
    selectedAlias?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSelectAddress: (addr: AddressOption) => void;
}

export const useAddressSelectUi = ({
    value,
    savedAddresses,
    savedAddressId,
    selectedAlias,
    onChange,
    onSelectAddress
}: UseAddressSelectUiProps) => {
    const { showNotification } = useNotification();
    const [isOpen, setIsOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [zipData, setZipData] = useState<ZipCodeResponse[]>([]);
    const [isLoadingZipData, setIsLoadingZipData] = useState(false);
    const [zipError, setZipError] = useState<string | undefined>(undefined);
    const containerRef = useRef<HTMLDivElement>(null);

    const displayValue = (!isFocused && savedAddressId && selectedAlias)
        ? `${value} - ${selectedAlias}`
        : value;

    useEffect(() => {
        const zip = value.toString();
        if (zip.length === 5 && isFocused) {
            fetchZipDetails(zip);
        } else if (zip.length !== 5) {
            setZipData([]);
        }
    }, [value, isFocused]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchZipDetails = async (zipCode: string) => {
        setIsLoadingZipData(true);
        setZipError(undefined);
        try {
            const data = await AddressServices.getZipCodeData(zipCode);
            setZipData(data);
            if (data.length > 0) setIsOpen(true);
        } catch (error: any) {
            console.error('Error fetching zip data:', error);
            setZipData([]);
            if (error.response?.status === 404) {
                const message = error.response.data?.message || `No se encontró el código postal: ${zipCode}`;
                showNotification('Código postal no encontrado', message, 'error');
                setZipError(message);
            }
        } finally {
            setIsLoadingZipData(false);
        }
    };

    const handleInternalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (/^[0-9]*$/.test(val)) {
            setZipError(undefined);
            onChange(e);
        }
    };

    const handleSelect = (addr: AddressOption) => {
        onSelectAddress(addr);
        setIsOpen(false);
        setIsFocused(false);
    };

    const handleFocus = () => {
        setIsFocused(true);
        setIsOpen(true);
    };

    const handleBlur = () => {
        setTimeout(() => {
            setIsFocused(false);
        }, 150);
    };

    const filteredAddresses = useMemo(() => {
        const val = value.toString();
        if (val.length === 0) return savedAddresses;
        if (val.length > 5) return []; 
        
        return savedAddresses.filter(addr => 
            addr.postalCode.startsWith(val)
        );
    }, [value, savedAddresses]);

    return {
        isOpen,
        isFocused,
        containerRef,
        displayValue,
        zipData,
        isLoadingZipData,
        zipError,
        filteredAddresses,
        handleInternalChange,
        handleSelect,
        handleFocus,
        handleBlur
    };
};
