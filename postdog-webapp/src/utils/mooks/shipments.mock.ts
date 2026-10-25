import { IOrder } from '../../types';

export const MOCK_SHIPMENTS: IOrder[] = [
    {
        uid: "shipment-id-1",
        orderNumber: 698557,
        trackingProvisional: "#O73KR1X57",
        status: "GENERATED",
        currency: "MXN",
        totals: {
            items: "135.00",
            insurance: "10.00",
            taxes: "0.00",
            grand: "145.00"
        },
        packagesCount: 1,
        productsCount: 2,
        createdAt: "2026-02-13T16:53:38.000Z",
        appLogo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
        quoteSelected: {
            uid: "q1",
            carrierCode: "DHL",
            serviceCode: "Express",
            priceAmount: 145,
            currency: "MXN",
            logoUrl: "https://api-pdog.softmena.dev/assets/logos/dhl.png"
        },
        originAddress: {
            fullName: "Juan Perez",
            postalCode: "06700",
            colony: "Roma Norte",
            addressLine: "Calle Colima 123",
            city: "CDMX",
            state: "Ciudad de México",
            country: "MX",
            phone: "5512345678",
            email: "juan@example.com",
            references: "Puerta roja",
            interiorNumber: "A-1",
            company: "Softmena",
            alias: "Oficina",
            rfc: "XAXX010101000",
            type: 'origin'
        },
        destinationAddress: {
            fullName: "Pedro Rodriguez",
            postalCode: "44160",
            colony: "Ladrón de Guevara",
            addressLine: "Av. México 456",
            city: "Guadalajara",
            state: "Jalisco",
            country: "MX",
            phone: "3398765432",
            email: "pedro@example.com",
            references: "Frente al parque",
            interiorNumber: "",
            company: "",
            alias: "Casa Pedro",
            rfc: "",
            type: 'destination'
        },
        packages: [
            {
                alias: "Paquete 1",
                packageType: "box",
                productType: "Varios",
                weightKg: 2,
                lengthCm: 20,
                widthCm: 20,
                heightCm: 20,
                items: [
                    {
                        name: "Producto 1",
                        sku: "SKU1",
                        quantity: 1,
                        unitPrice: 100,
                    },
                    {
                        name: "Producto 2",
                        sku: "SKU2",
                        quantity: 2,
                        unitPrice: 200,
                    }
                ]
            }
        ]
    },
    {
        uid: "shipment-id-2",
        orderNumber: 698597,
        trackingProvisional: "#123456789",
        status: "GENERATED",
        currency: "MXN",
        totals: {
            items: "210.00",
            insurance: "0.00",
            taxes: "0.00",
            grand: "210.00"
        },
        packagesCount: 2,
        productsCount: 5,
        createdAt: "2026-02-11T14:52:39.000Z",
        appLogo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
        quoteSelected: {
            uid: "q2",
            carrierCode: "ESTAFETA",
            serviceCode: "Standard",
            priceAmount: 210,
            currency: "MXN",
            logoUrl: "https://api-pdog.softmena.dev/assets/logos/estafeta.png"
        },
        originAddress: {
            fullName: "Maria Garcia",
            postalCode: "64000",
            colony: "Centro",
            addressLine: "Av. Constitución 789",
            city: "Monterrey",
            state: "Nuevo León",
            country: "MX",
            phone: "8187654321",
            email: "maria@example.com",
            references: "Esquina con Hidalgo",
            interiorNumber: "5",
            company: "PostDog",
            alias: "Bodega Mty",
            rfc: "",
            type: 'origin'
        },
        destinationAddress: {
            fullName: "Liam Castillo",
            postalCode: "88776",
            colony: "Villas de Imaq",
            addressLine: "Calle 10 321",
            city: "Reynosa",
            state: "Tamaulipas",
            country: "MX",
            phone: "8991234567",
            email: "liam@example.com",
            references: "Portón blanco",
            interiorNumber: "",
            company: "",
            alias: "Sucursal Reynosa",
            rfc: "",
            type: 'destination'
        },
        packages: [
            {
                alias: "Caja Grande",
                packageType: "box",
                productType: "Ropa",
                weightKg: 5,
                lengthCm: 40,
                widthCm: 40,
                heightCm: 30,
                items: [
                    {
                        name: "Producto 1",
                        sku: "SKU1",
                        quantity: 1,
                        unitPrice: 100,
                    },
                    {
                        name: "Producto 2",
                        sku: "SKU2",
                        quantity: 2,
                        unitPrice: 200,
                    }
                ]
            }
        ]
    },
    {
        uid: "shipment-id-3",
        orderNumber: 698597,
        trackingProvisional: "#123456789",
        status: "GENERATED",
        currency: "MXN",
        totals: {
            items: "210.00",
            insurance: "0.00",
            taxes: "0.00",
            grand: "210.00"
        },
        appLogo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
        packagesCount: 2,
        productsCount: 5,
        createdAt: "2026-02-11T14:52:39.000Z",
        quoteSelected: {
            uid: "q2",
            carrierCode: "ESTAFETA",
            serviceCode: "Standard",
            priceAmount: 210,
            currency: "MXN",
            logoUrl: "https://api-pdog.softmena.dev/assets/logos/estafeta.png"
        },
        originAddress: {
            fullName: "Maria Garcia",
            postalCode: "64000",
            colony: "Centro",
            addressLine: "Av. Constitución 789",
            city: "Monterrey",
            state: "Nuevo León",
            country: "MX",
            phone: "8187654321",
            email: "maria@example.com",
            references: "Esquina con Hidalgo",
            interiorNumber: "5",
            company: "PostDog",
            alias: "Bodega Mty",
            rfc: "",
            type: 'origin'
        },
        destinationAddress: {
            fullName: "Liam Castillo",
            postalCode: "88776",
            colony: "Villas de Imaq",
            addressLine: "Calle 10 321",
            city: "Reynosa",
            state: "Tamaulipas",
            country: "MX",
            phone: "8991234567",
            email: "liam@example.com",
            references: "Portón blanco",
            interiorNumber: "",
            company: "",
            alias: "Sucursal Reynosa",
            rfc: "",
            type: 'destination'
        },
        packages: [
            {
                alias: "Caja Grande",
                packageType: "box",
                productType: "Ropa",
                weightKg: 5,
                lengthCm: 40,
                widthCm: 40,
                heightCm: 30,
                items: [
                    {
                        name: "Producto 1",
                        sku: "SKU1",
                        quantity: 1,
                        unitPrice: 100,
                    },
                    {
                        name: "Producto 2",
                        sku: "SKU2",
                        quantity: 2,
                        unitPrice: 200,
                    },
                    {
                        name: "Producto 3",
                        sku: "SKU3",
                        quantity: 3,
                        unitPrice: 300,
                    },
                    {
                        name: "Producto 4",
                        sku: "SKU4",
                        quantity: 4,
                        unitPrice: 400,
                    },
                    {
                        name: "Producto 5",
                        sku: "SKU5",
                        quantity: 5,
                        unitPrice: 500,
                    }
                ]
            }
        ]
    },
    {
        uid: "shipment-id-4",
        orderNumber: 698597,
        trackingProvisional: "#123456789",
        status: "GENERATED",
        currency: "MXN",
        totals: {
            items: "210.00",
            insurance: "0.00",
            taxes: "0.00",
            grand: "210.00"
        },
        appLogo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
        packagesCount: 2,
        productsCount: 5,
        createdAt: "2026-02-11T14:52:39.000Z",
        quoteSelected: {
            uid: "q2",
            carrierCode: "ESTAFETA",
            serviceCode: "Standard",
            priceAmount: 210,
            currency: "MXN",
            logoUrl: "https://api-pdog.softmena.dev/assets/logos/estafeta.png"
        },
        originAddress: {
            fullName: "Maria Garcia",
            postalCode: "64000",
            colony: "Centro",
            addressLine: "Av. Constitución 789",
            city: "Monterrey",
            state: "Nuevo León",
            country: "MX",
            phone: "8187654321",
            email: "maria@example.com",
            references: "Esquina con Hidalgo",
            interiorNumber: "5",
            company: "PostDog",
            alias: "Bodega Mty",
            rfc: "",
            type: 'origin'
        },
        destinationAddress: {
            fullName: "Liam Castillo",
            postalCode: "88776",
            colony: "Villas de Imaq",
            addressLine: "Calle 10 321",
            city: "Reynosa",
            state: "Tamaulipas",
            country: "MX",
            phone: "8991234567",
            email: "liam@example.com",
            references: "Portón blanco",
            interiorNumber: "",
            company: "",
            alias: "Sucursal Reynosa",
            rfc: "",
            type: 'destination'
        },
        packages: [
            {
                alias: "Caja Grande",
                packageType: "box",
                productType: "Ropa",
                weightKg: 5,
                lengthCm: 40,
                widthCm: 40,
                heightCm: 30,
                items: []
            }
        ]
    },
    {
        uid: "shipment-id-5",
        orderNumber: 698597,
        trackingProvisional: "#123456789",
        status: "CANCELLED",
        currency: "MXN",
        totals: {
            items: "210.00",
            insurance: "0.00",
            taxes: "0.00",
            grand: "210.00"
        },
        packagesCount: 2,
        productsCount: 5,
        createdAt: "2026-02-11T14:52:39.000Z",
        appLogo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
        quoteSelected: {
            uid: "q2",
            carrierCode: "ESTAFETA",
            serviceCode: "Standard",
            priceAmount: 210,
            currency: "MXN",
            logoUrl: "https://api-pdog.softmena.dev/assets/logos/estafeta.png"
        },
        originAddress: {
            fullName: "Juan Perez",
            postalCode: "64000",
            colony: "Centro",
            addressLine: "Av. Constitución 789",
            city: "Monterrey",
            state: "Nuevo León",
            country: "MX",
            phone: "8187654321",
            email: "juan@example.com",
            references: "Esquina con Hidalgo",
            interiorNumber: "5",
            company: "PostDog",
            alias: "Bodega Mty",
            rfc: "",
            type: 'origin'
        },
        destinationAddress: {
            fullName: "Liam Castillo",
            postalCode: "88776",
            colony: "Villas de Imaq",
            addressLine: "Calle 10 321",
            city: "Reynosa",
            state: "Tamaulipas",
            country: "MX",
            phone: "8991234567",
            email: "liam@example.com",
            references: "Portón blanco",
            interiorNumber: "",
            company: "",
            alias: "Sucursal Reynosa",
            rfc: "",
            type: 'destination'
        },
        packages: [
            {
                alias: "Caja Grande",
                packageType: "box",
                productType: "Ropa",
                weightKg: 5,
                lengthCm: 40,
                widthCm: 40,
                heightCm: 30,
                items: []
            }
        ]
    },
    {
        uid: "shipment-id-6",
        orderNumber: 698597,
        trackingProvisional: "#000000000",
        status: "CANCELLED",
        currency: "MXN",
        totals: {
            items: "210.00",
            insurance: "0.00",
            taxes: "0.00",
            grand: "210.00"
        },
        packagesCount: 2,
        productsCount: 5,
        createdAt: "2026-02-11T14:52:39.000Z",
        appLogo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
        quoteSelected: {
            uid: "q2",
            carrierCode: "ESTAFETA",
            serviceCode: "Standard",
            priceAmount: 210,
            currency: "MXN",
            logoUrl: "https://api-pdog.softmena.dev/assets/logos/estafeta.png"
        },
        originAddress: {
            fullName: "Juan Perez",
            postalCode: "64000",
            colony: "Centro",
            addressLine: "Av. Constitución 789",
            city: "Monterrey",
            state: "Nuevo León",
            country: "MX",
            phone: "8187654321",
            email: "juan@example.com",
            references: "Esquina con Hidalgo",
            interiorNumber: "5",
            company: "PostDog",
            alias: "Bodega Mty",
            rfc: "",
            type: 'origin'
        },
        destinationAddress: {
            fullName: "Liam Castillo",
            postalCode: "88776",
            colony: "Villas de Imaq",
            addressLine: "Calle 10 321",
            city: "Reynosa",
            state: "Tamaulipas",
            country: "MX",
            phone: "8991234567",
            email: "liam@example.com",
            references: "Portón blanco",
            interiorNumber: "",
            company: "",
            alias: "Sucursal Reynosa",
            rfc: "",
            type: 'destination'
        },
        packages: [
            {
                alias: "Caja Grande",
                packageType: "box",
                productType: "Ropa",
                weightKg: 5,
                lengthCm: 40,
                widthCm: 40,
                heightCm: 30,
                items: []
            }
        ]
    },
    {
        uid: "shipment-id-7",
        orderNumber: 698597,
        trackingProvisional: "#000000000",
        status: "CANCELLED",
        currency: "MXN",
        totals: {
            items: "210.00",
            insurance: "0.00",
            taxes: "0.00",
            grand: "210.00"
        },
        packagesCount: 2,
        productsCount: 5,
        createdAt: "2026-02-11T14:52:39.000Z",
        appLogo: 'https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/696d57c128edcb7e48db54d9/d14a2549a_LOGOAPP.png',
        quoteSelected: {
            uid: "q2",
            carrierCode: "ESTAFETA",
            serviceCode: "Standard",
            priceAmount: 210,
            currency: "MXN",
            logoUrl: "https://api-pdog.softmena.dev/assets/logos/estafeta.png"
        },
        originAddress: {
            fullName: "Juan Perez",
            postalCode: "64000",
            colony: "Centro",
            addressLine: "Av. Constitución 789",
            city: "Monterrey",
            state: "Nuevo León",
            country: "MX",
            phone: "8187654321",
            email: "juan@example.com",
            references: "Esquina con Hidalgo",
            interiorNumber: "5",
            company: "PostDog",
            alias: "Bodega Mty",
            rfc: "",
            type: 'origin'
        },
        destinationAddress: {
            fullName: "Liam Castillo",
            postalCode: "88776",
            colony: "Villas de Imaq",
            addressLine: "Calle 10 321",
            city: "Reynosa",
            state: "Tamaulipas",
            country: "MX",
            phone: "8991234567",
            email: "liam@example.com",
            references: "Portón blanco",
            interiorNumber: "",
            company: "",
            alias: "Sucursal Reynosa",
            rfc: "",
            type: 'destination'
        },
        packages: [
            {
                alias: "Caja Grande",
                packageType: "box",
                productType: "Ropa",
                weightKg: 5,
                lengthCm: 40,
                widthCm: 40,
                heightCm: 30,
                items: []
            }
        ]
    },
    
];