import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { AddressData, PackageData, ProductData, ShipmentState, ShipmentContextType } from '../types';
import AddressServices from '../services/AddressService';
import PackageService from '../services/PackageService';

const initialAddress: AddressData = {
  street: '', internalNumber: '', zipCode: '', colony: '', country: 'MX',
  state: '', city: '', reference: '', fullName: '', phone: '', email: '',
  company: '', rfc: '', saveAddress: false, alias: '', savedAddressId: undefined
};

const initialPackage = (id: number): PackageData => ({
  id, length: '', width: '', height: '', weight: '',
  productTypeCode: '', productTypeDescription: '',
  savePackage: false, savedPackageId: '', alias: '', products: [], showProducts: false
});

const ShipmentContext = createContext<ShipmentContextType | undefined>(undefined);

export const ShipmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const [isModalCreateShipmentOpen, setIsModalCreateShipmentOpen] = useState(false);
  const [isRemitterEditing, setIsRemitterEditing] = useState(false);
  const [isAddresseeEditing, setIsAddresseeEditing] = useState(false);
  const [isPackageEditing, setIsPackageEditing] = useState(true);

  const [state, setState] = useState<ShipmentState>({
    remitter: { ...initialAddress },
    addressee: { ...initialAddress },
    packages: [initialPackage(Date.now())],
    selectedPackaging: null,
    insurance: {
      active: true,
      declaredValue: '1000',
      cost: 10
    },
    isDuplicating: false,
    shippingType: 'create',
    errors: {
      remitter: {},
      addressee: {},
      packages: {}
    }
  });

  const selectPackaging = useCallback((packaging: any) => setState(prev => ({ ...prev, selectedPackaging: packaging })), []);

  const openModalCreateShipment = useCallback(() => setIsModalCreateShipmentOpen(true), []);
  const closeModalCreateShipment = useCallback(() => {
    setIsModalCreateShipmentOpen(false);
    setIsRemitterEditing(false);
    setIsAddresseeEditing(false);
    setIsPackageEditing(true);
    setState({
      remitter: { ...initialAddress },
      addressee: { ...initialAddress },
      packages: [initialPackage(Date.now())],
      selectedPackaging: null,
      insurance: {
        active: true,
        declaredValue: '1000',
        cost: 10
      },
      isDuplicating: false,
      shippingType: 'create',
      errors: {
        remitter: {},
        addressee: {},
        packages: {}
      }
    });
  }, []);

  const updateInsurance = useCallback((data: Partial<ShipmentState['insurance']>) =>
    setState(prev => ({ ...prev, insurance: { ...prev.insurance, ...data } })), []);

  const setErrors = useCallback((errors: any) => {
    setState(prev => ({ ...prev, errors: { ...prev.errors, ...errors } }));
  }, []);

  const clearRemitter = useCallback(() => {
    setState(prev => ({
      ...prev,
      remitter: { ...initialAddress },
      isDuplicating: false,
      errors: { ...prev.errors, remitter: {} }
    }));
  }, []);

  const clearAddressee = useCallback(() => {
    setState(prev => ({
      ...prev,
      addressee: { ...initialAddress },
      isDuplicating: false,
      errors: { ...prev.errors, addressee: {} }
    }));
  }, []);

  const clearPackage = useCallback(() => {
    setState(prev => ({
      ...prev,
      packages: [initialPackage(Date.now())],
      isDuplicating: false,
      errors: { ...prev.errors, packages: {} }
    }));
  }, []);

  const updateRemitter = useCallback((data: Partial<AddressData>) =>
    setState(prev => {
      const newErrors = { ...prev.errors.remitter };
      Object.keys(data).forEach(key => {
        delete newErrors[key];
      });
      return { 
        ...prev, 
        remitter: { ...prev.remitter, ...data },
        errors: { ...prev.errors, remitter: newErrors }
      };
    }), []);

  const updateAddressee = useCallback((data: Partial<AddressData>) =>
    setState(prev => {
      const newErrors = { ...prev.errors.addressee };
      Object.keys(data).forEach(key => {
        delete newErrors[key];
      });
      return { 
        ...prev, 
        addressee: { ...prev.addressee, ...data },
        errors: { ...prev.errors, addressee: newErrors }
      };
    }), []);

  const addPackage = useCallback(() =>
    setState(prev => ({ ...prev, packages: [...prev.packages, initialPackage(Date.now())] })), []);

  const removePackage = useCallback((id: number) =>
    setState(prev => ({ 
      ...prev, 
      packages: prev.packages.filter(p => p.id !== id),
      errors: {
        ...prev.errors,
        packages: Object.fromEntries(Object.entries(prev.errors.packages).filter(([key]) => Number(key) !== id))
      }
    })), []);

  const updatePackage = useCallback((id: number, data: Partial<PackageData>) =>
    setState(prev => {
      const pkgErrors = { ...(prev.errors.packages[id] || {}) };
      Object.keys(data).forEach(key => {
        delete pkgErrors[key];
      });
      return {
        ...prev,
        packages: prev.packages.map(p => p.id === id ? { ...p, ...data } : p),
        errors: {
          ...prev.errors,
          packages: {
            ...prev.errors.packages,
            [id]: pkgErrors
          }
        }
      };
    }), []);

  const addProductToPackage = useCallback((packageId: number) => {
    setState(prev => ({
      ...prev,
      packages: prev.packages.map(p => p.id === packageId ? {
        ...p, products: [...p.products, { id: Date.now(), name: '', sku: '', price: '', quantity: '' }]
      } : p)
    }));
  }, []);

  const removeProductFromPackage = useCallback((packageId: number, productId: number) => {
    setState(prev => ({
      ...prev,
      packages: prev.packages.map(p => p.id === packageId ? {
        ...p, products: p.products.filter(prod => prod.id !== productId)
      } : p)
    }));
  }, []);

  const updateProduct = useCallback((packageId: number, productId: number, data: Partial<ProductData>) => {
    setState(prev => ({
      ...prev,
      packages: prev.packages.map(p => p.id === packageId ? {
        ...p, products: p.products.map(prod => prod.id === productId ? { ...prod, ...data } : prod)
      } : p)
    }));
  }, []);

  const duplicatePackage = useCallback((id: number) => {
    setState(prev => {
      const pkgToDuplicate = prev.packages.find(p => p.id === id);
      if (!pkgToDuplicate) return prev;
      
      const newPackage = {
        ...pkgToDuplicate,
        id: Date.now(),
        products: pkgToDuplicate.products.map(prod => ({ ...prod, id: Date.now() + Math.random() }))
      };
      
      return {
        ...prev,
        packages: [...prev.packages, newPackage]
      };
    });
  }, []);

  const resetShipment = useCallback(() => {
    setIsRemitterEditing(false);
    setIsAddresseeEditing(false);
    setIsPackageEditing(true);
    setState({
      remitter: { ...initialAddress },
      addressee: { ...initialAddress },
      packages: [initialPackage(Date.now())],
      selectedPackaging: null,
      insurance: {
        active: true,
        declaredValue: '1000',
        cost: 10
      },
      isDuplicating: false,
      shippingType: 'create',
      errors: {
        remitter: {},
        addressee: {},
        packages: {}
      }
    });
  }, []);

  const openCreateReturn = useCallback((order: any) => {
    const mapAddressToData = (addr: any): AddressData => ({
      street: addr.addressLine || '',
      internalNumber: addr.interiorNumber || '',
      zipCode: addr.postalCode || '',
      colony: addr.colony || '',
      country: addr.country || 'MX',
      state: addr.state || '',
      city: addr.city || '',
      reference: addr.references || '',
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      email: addr.email || '',
      company: addr.company || '',
      rfc: addr.rfc || '',
      saveAddress: false,
      alias: ''
    });

    const mappedPackages: PackageData[] = (order.packages || []).map((pkg: any, index: number) => ({
      id: Date.now() + index,
      length: pkg.lengthCm ? Math.round(Number(pkg.lengthCm)).toString() : '',
      width: pkg.widthCm ? Math.round(Number(pkg.widthCm)).toString() : '',
      height: pkg.heightCm ? Math.round(Number(pkg.heightCm)).toString() : '',
      weight: pkg.weightKg ? Math.round(Number(pkg.weightKg)).toString() : '',
      productTypeCode: (pkg.productType || '').split(' - ')[0]?.trim() || '',
      productTypeDescription: (pkg.productType || '').split(' - ').slice(1).join(' - ')?.trim() || '',
      savePackage: false,
      alias: pkg.alias || '',
      products: (pkg.items || []).map((item: any) => ({
        id: Date.now() + Math.random(),
        name: item.name,
        sku: item.sku,
        price: String(item.unitPrice),
        quantity: String(item.quantity)
      })),
      showProducts: false
    }));

    setState({
      remitter: mapAddressToData(order.destinationAddress),   
      addressee: mapAddressToData(order.originAddress),    
      packages: mappedPackages.length > 0 ? mappedPackages : [initialPackage(Date.now())],
      selectedPackaging: null,
      insurance: {
        active: true,
        declaredValue: '1000',
        cost: 10
      },
      isDuplicating: true,
      shippingType: 'return',
      errors: {
        remitter: {},
        addressee: {},
        packages: {}
      }
    });
    setIsModalCreateShipmentOpen(true);
  }, []);

  const openDuplicateShipment = useCallback((order: any) => {
    const mapAddressToData = (addr: any): AddressData => ({
      street: addr.addressLine || '',
      internalNumber: addr.interiorNumber || '',
      zipCode: addr.postalCode || '',
      colony: addr.colony || '',
      country: addr.country || 'MX',
      state: addr.state || '',
      city: addr.city || '',
      reference: addr.references || '',
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      email: addr.email || '',
      company: addr.company || '',
      rfc: addr.rfc || '',
      saveAddress: false,
      alias: ''
    });

    const mappedPackages: PackageData[] = (order.packages || []).map((pkg: any, index: number) => (
      {
      id: Date.now() + index,
      length: pkg.lengthCm ? Math.round(Number(pkg.lengthCm)).toString() : '',
      width: pkg.widthCm ? Math.round(Number(pkg.widthCm)).toString() : '',
      height: pkg.heightCm ? Math.round(Number(pkg.heightCm)).toString() : '',
      weight: pkg.weightKg ? Math.round(Number(pkg.weightKg)).toString() : '',
      productTypeCode: (pkg.productType || '').split(' - ')[0]?.trim() || '',
      productTypeDescription: (pkg.productType || '').split(' - ').slice(1).join(' - ')?.trim() || '',
      savePackage: false,
      alias: pkg.alias || '',
      products: (pkg.items || []).map((item: any) => ({
        id: Date.now() + Math.random(),
        name: item.name,
        sku: item.sku,
        price: String(item.unitPrice),
        quantity: String(item.quantity)
      })),
      showProducts: false
    }));

    setState({
      remitter: mapAddressToData(order.originAddress),
      addressee: mapAddressToData(order.destinationAddress),
      packages: mappedPackages.length > 0 ? mappedPackages : [initialPackage(Date.now())],
      selectedPackaging: null,
      insurance: {
        active: true,
        declaredValue: '1000',
        cost: 10
      },
      isDuplicating: true,
      shippingType: 'duplicate',
      errors: {
          remitter: {},
          addressee: {},
          packages: {}
      }
    });
    setIsModalCreateShipmentOpen(true);
  }, []);

const openCreateShipmentFromOrder = useCallback(async (order: any) => {
    let favoriteAddress = null;
    let favoritePkg = null;

    try {
        const [addrRes, pkgRes] = await Promise.allSettled([
            AddressServices.getFavoriteAddressService(),
            PackageService.getFavoritePackage()
        ]);
        
        if (addrRes.status === 'fulfilled') favoriteAddress = addrRes.value;
        if (pkgRes.status === 'fulfilled') favoritePkg = pkgRes.value;
    } catch (error) {
        console.error("Error fetching favorites:", error);
    }

    const mapAddressToData = (addr: any): AddressData => ({
        street: addr?.addressLine || addr?.street || '',
        internalNumber: addr?.interiorNumber || addr?.internalNumber || '',
        zipCode: addr?.postalCode || '',
        colony: addr?.colony || '',
        country: addr?.country || 'MX',
        state: addr?.state || '',
        city: addr?.city || '',
        reference: addr?.references || '',
        fullName: addr?.fullName || '',
        phone: addr?.phone || '',
        email: addr?.email || '',
        company: addr?.company || '',
        rfc: addr?.rfc || '',
        saveAddress: false,
        alias: addr?.alias || '',
        savedAddressId: addr?.uid || undefined
    });

    const mappedPackages: PackageData[] = (order.packages || []).map((pkg: any, index: number) => ({
        id: Date.now() + index,
        length: pkg.lengthCm ? Math.round(Number(pkg.lengthCm)).toString() : '',
        width: pkg.widthCm ? Math.round(Number(pkg.widthCm)).toString() : '',
        height: pkg.heightCm ? Math.round(Number(pkg.heightCm)).toString() : '',
        weight: pkg.weightKg ? Math.round(Number(pkg.weightKg)).toString() : '',
        productTypeCode: (pkg.productType || '').split(' - ')[0]?.trim() || '',
        productTypeDescription: (pkg.productType || '').split(' - ').slice(1).join(' - ')?.trim() || '',
        savePackage: false,
        savedPackageId: pkg.uid || undefined,
        alias: pkg.alias || '',
        products: (pkg.items || []).map((item: any) => ({
            id: Date.now() + Math.random(),
            name: item.name,
            sku: item.sku,
            price: String(item.unitPrice || ''),
            quantity: String(item.quantity || '')
        })),
        showProducts: false
    }));

    let finalPackages = mappedPackages;
    if (finalPackages.length === 0 && favoritePkg) {
        finalPackages = [{
            id: Date.now(),
            length: favoritePkg.lengthCm ? Math.round(Number(favoritePkg.lengthCm)).toString() : '',
            width: favoritePkg.widthCm ? Math.round(Number(favoritePkg.widthCm)).toString() : '',
            height: favoritePkg.heightCm ? Math.round(Number(favoritePkg.heightCm)).toString() : '',
            weight: favoritePkg.weightKg ? Math.round(Number(favoritePkg.weightKg)).toString() : '',
            productTypeCode: (favoritePkg.productType || '').split(' - ')[0]?.trim() || '',
            productTypeDescription: (favoritePkg.productType || '').split(' - ').slice(1).join(' - ')?.trim() || '',
            savePackage: false,
            savedPackageId: favoritePkg.uid,
            alias: favoritePkg.alias || '',
            products: [],
            showProducts: false
        }];
    }

    setState({
        remitter: favoriteAddress ? mapAddressToData(favoriteAddress) : { ...initialAddress },
        addressee: mapAddressToData(order.destinationAddress),
        packages: finalPackages.length > 0 ? finalPackages : [initialPackage(Date.now())],
        selectedPackaging: null,
        insurance: {
            active: true,
            declaredValue: '1000',
            cost: 10
        },
        isDuplicating: false,
        selectedOrder: order,
        shippingType: 'from_order',
        errors: {
            remitter: {},
            addressee: {},
            packages: {}
        }
    });
    setIsModalCreateShipmentOpen(true);
}, []);

  return (
    <ShipmentContext.Provider value={{
      state, updateRemitter, updateAddressee, addPackage,
      removePackage, updatePackage, addProductToPackage,
      removeProductFromPackage, updateProduct, resetShipment,
      clearRemitter, clearAddressee, clearPackage, selectPackaging, updateInsurance,
      duplicatePackage, openModalCreateShipment, closeModalCreateShipment, isModalCreateShipmentOpen,
      openCreateReturn, openDuplicateShipment, openCreateShipmentFromOrder,
      setErrors, isRemitterEditing, setIsRemitterEditing, isAddresseeEditing, 
      setIsAddresseeEditing, isPackageEditing, setIsPackageEditing
    }}>
      {children}
    </ShipmentContext.Provider>
  );
};

export const useCreateShipmentContext = () => {
  const context = useContext(ShipmentContext);
  if (!context) throw new Error('useCreateShipmentContext must be used within CreateShipmentContextProvider');
  return context;
};