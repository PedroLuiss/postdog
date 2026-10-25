import { OrderStatus, ShipmentHistoryItem, IOrder, Address } from '../../types';


export const mapShipmentHistoryList = (item: ShipmentHistoryItem): IOrder => {
    return {
        uid: item.uid || '',
        orderNumber: item.source?.identifier || 0,
        trackingProvisional: item.trackingProvisional || '',
        status: item.status as OrderStatus,
        currency: (item.currency || 'MXN') as 'MXN' | 'USD' | 'EUR',
        createdAt: item.createdAt || '',
        appLogo: item.source?.logoUrl || 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
        totals: {
            items: "0.00",
            insurance: item.totalsInsurance || "0.00",
            taxes: item.totalsTaxes || "0.00",
            grand: item.totalsGrand || "0.00"
        },
        originAddress: {
            type: 'origin',
            addressLine: item.originAddress?.addressLine,
            postalCode: item.originAddress?.postalCode,
            city: item.originAddress?.city,
            state: item.originAddress?.state,
            country: 'MX',
            fullName: item.originAddress?.fullName,
        } as Address,
        destinationAddress: {
            type: 'destination',
            addressLine: item.destinationAddress?.addressLine,
            postalCode: item.destinationAddress?.postalCode,
            city: item.destinationAddress?.city,
            state: item.destinationAddress?.state,
            country: 'MX',
            fullName: item.destinationAddress?.fullName,
        } as Address,
        quoteSelected: {
            uid: item.carrier?.uid,
            carrierCode: item.carrier?.carrierCode,
            serviceCode: item.carrier?.serviceCode,
            serviceName: item.carrier?.serviceName,
            priceAmount: parseFloat(item.carrier?.priceAmount || "0"),
            currency: item.currency || 'MXN',
            logoUrl: item.carrier?.logoUrl,
            pickupAvailable: item.carrier?.pickupAvailable || false,
            trackingAvailable: item.carrier?.trackingAvailable || false,
            thermalPrintingAvailable: item.carrier?.thermalPrintingAvailable || false
        },
        carrier: {
            name: item.carrier?.carrierName,
            service: item.carrier?.serviceName
        }
    } as IOrder;
};


export const mapShipmentDetailApiToOrder = (item: any): IOrder => {
    return {
        uid: item.uid || '',
        orderNumber: item.shipmentNumber || 0,
        trackingProvisional: item.trackingProvisional || '',
        status: item.status as OrderStatus,
        currency: (item.currency || 'MXN') as 'MXN' | 'USD' | 'EUR',
        createdAt: item.createdAt || '',
        packagesCount: item.packages ? item.packages.length : 0,
        appLogo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
        productsCount: 0,
        totals: {
            items: item.totals?.items || "0.00",
            insurance: item.totals?.insurance || "0.00",
            taxes: item.totals?.taxes || "0.00",
            grand: item.totals?.grand || "0.00"
        },
        originAddress: {
            uid: item.originAddress?.uid || '',
            type: 'origin',
            addressLine: item.originAddress?.addressLine || '',
            interiorNumber: item.originAddress?.interiorNumber || '',
            colony: item.originAddress?.colony || '',
            postalCode: item.originAddress?.postalCode || '',
            city: item.originAddress?.city || '',
            state: item.originAddress?.state || '',
            country: item.originAddress?.country || 'MX',
            references: item.originAddress?.references || '',
            fullName: item.originAddress?.fullName || '',
            phone: item.originAddress?.phone || '',
            email: item.originAddress?.email || '',
            company: item.originAddress?.company || '',
            alias: item.originAddress?.alias || '',
            rfc: item.originAddress?.rfc || ''
        },
        destinationAddress: {
            uid: item.destinationAddress?.uid || '',
            type: 'destination',
            addressLine: item.destinationAddress?.addressLine || '',
            interiorNumber: item.destinationAddress?.interiorNumber || '',
            colony: item.destinationAddress?.colony || '',
            postalCode: item.destinationAddress?.postalCode || '',
            city: item.destinationAddress?.city || '',
            state: item.destinationAddress?.state || '',
            country: item.destinationAddress?.country || 'MX',
            references: item.destinationAddress?.references || '',
            fullName: item.destinationAddress?.fullName || '',
            phone: item.destinationAddress?.phone || '',
            email: item.destinationAddress?.email || '',
            company: item.destinationAddress?.company || '',
            alias: item.destinationAddress?.alias || '',
            rfc: item.destinationAddress?.rfc || ''
        },
        quoteSelected: {
            uid: item.quoteSelected?.uid || '',
            carrierCode: item.quoteSelected?.carrierCode || '',
            serviceCode: item.quoteSelected?.serviceCode || '',
            priceAmount: item.quoteSelected?.priceAmount || 0,
            currency: item.quoteSelected?.currency || item.currency || 'MXN',
            logoUrl: item.quoteSelected?.snapshot?.logoUrl || ''
        },
        carrier: {
            name: item.quoteSelected?.carrierName || '',
            service: item.quoteSelected?.serviceName || ''
        },
        packages: item.packages?.map((pkg: any) => ({
            id: pkg.uid || String(Math.random()),
            alias: pkg.alias || '',
            packageType: pkg.packageType || '',
            productType: pkg.productType || '',
            weightKg: pkg.weightKg || 0,
            lengthCm: pkg.lengthCm || 0,
            widthCm: pkg.widthCm || 0,
            heightCm: pkg.heightCm || 0,
            items: pkg.items?.map((prod: any) => ({
                id: prod.uid || String(Math.random()),
                name: prod.name || '',
                sku: prod.sku || '',
                unitPrice: prod.unitPrice || 0,
                quantity: prod.quantity || 0
            })) || []
        })) || []
    };
};
