import { OrderPickups } from '../../types';


export const mapApiOrders = (item: any): OrderPickups => {
    return {
        uid: item.uid,
        trackingProvisional: item.externalOrderId || item.uid,
        createdAt: item.externalCreatedAt || item.createdAt,
        status: item.status === 'PENDING_SHIPMENT' ? 'PENDING' : item.status,
        orderNumber: item.source.identifier,
        source: {
            type: item.source.type,
            platform: item.source.platform,
            identifier: item.source.identifier,
            logoUrl: item.source.logoUrl
        },
        products: {
            quantity: item.productsCount || 0
        },
        originAddress: {
            fullName: 'Postdog User',
            postalCode: '00000',
            colony: 'Default Origin'
        },
        destinationAddress: {
            fullName: item.destination?.fullName || 'N/A',
            postalCode: item.destination?.postalCode || '00000',
            colony: item.destination?.city || 'N/A',
            street: item.destination?.address || 'N/A',
            phone: item.destination?.phone || 'N/A',
            email: item.destination?.email || 'N/A',
            interiorNumber: item.destination?.interiorNumber || 'N/A',
            
        },
        package: {
            packageType: 'Box',
            weightKg: 1,
            lengthCm: 10,
            widthCm: 10,
            heightCm: 10
        },
        quoteCarrier: {
            carrierName: item.carrier?.name || 'N/A',
            logoUrl: item.carrier?.logoUrl || '',
            pickupAvailable: true,
            deliveryDaysMin: item.carrier?.deliveryDaysMin || 0,
            deliveryDaysMax: item.carrier?.deliveryDaysMax || 0,
            price: item.carrier?.price ? parseFloat(String(item.carrier.price)) : 0
        },
        store: item.ecommerceSource 
            ? (item.ecommerceSource.charAt(0).toUpperCase() + item.ecommerceSource.slice(1).toLowerCase()) 
            : 'Postdog'
    };
};
