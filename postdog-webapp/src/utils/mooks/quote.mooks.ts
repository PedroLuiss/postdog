import { Quote } from "../../types";

import imagedhl from "../../assets/img/Quote/imagedhl.png";
import fedex from "../../assets/img/Quote/fedex.png";
import estafeta from "../../assets/img/Quote/estafeta.png";
import jtexpress from "../../assets/img/Quote/jtexpress.png";

export const mockQuotesData: Quote[] = [
    { id: "1", courierLogo: imagedhl, courierName: 'DHL', selected: true, service: 'Express', pickup: 'Disponible', deliveryEstimateDays: 2, price: 145.00, pickupAvailable: true, trackingAvailable: true, thermalPrintingAvailable: true },
    { id: "2", courierLogo: imagedhl, courierName: 'DHL', service: 'Standard', pickup: 'Disponible', deliveryEstimateDays: 2, price: 210.00, pickupAvailable: true, trackingAvailable: true, thermalPrintingAvailable: true },
    { id: "3", courierLogo: fedex, courierName: 'FedEx', service: 'Fedex Express Saver', pickup: 'Disponible', deliveryEstimateDays: 1, price: 250.00, pickupAvailable: true, trackingAvailable: true, thermalPrintingAvailable: true },
    { id: "4", courierLogo: estafeta, courierName: 'Estafeta', service: 'Servicio Express', pickup: 'Disponible', deliveryEstimateDays: 1, price: 250.00, pickupAvailable: true, trackingAvailable: true, thermalPrintingAvailable: true },
    { id: "5", courierLogo: jtexpress, courierName: 'J&T Express', service: 'Nacional', pickup: 'No disponible', deliveryEstimateDays: 1, price: 250.00, pickupAvailable: false, trackingAvailable: true, thermalPrintingAvailable: true },
];

export const MOCK_STREAM_EVENTS = [
    {
        "type": "start",
        "ts": "2026-02-19T21:13:32.477Z"
    },
    {
        "type": "item",
        "data": {
            "uid": "jnt-nacional:24b2bfe8-9f93-4a23-a755-86feb018450d",
            "carrierCode": "JNT",
            "carrierName": "J&T Express",
            "serviceCode": "nacional",
            "priceAmount": 235,
            "currency": "MXN",
            "deliveryDaysMin": 1,
            "deliveryDaysMax": 1,
            "pickupAvailable": false,
            "logoUrl": "https://api-pdog.softmena.dev/assets/logos/jnt.png",
            "t_ms": 258
        }
    },
    {
        "type": "item",
        "data": {
            "uid": "dhl-express:24b2bfe8-9f93-4a23-a755-86feb018450d",
            "carrierCode": "DHL",
            "carrierName": "DHL",
            "serviceCode": "express",
            "priceAmount": 250,
            "currency": "MXN",
            "deliveryDaysMin": 2,
            "deliveryDaysMax": 3,
            "pickupAvailable": true,
            "logoUrl": "https://api-pdog.softmena.dev/assets/logos/dhl.png",
            "t_ms": 319
        }
    },
    {
        "type": "item",
        "data": {
            "uid": "estafeta-express:24b2bfe8-9f93-4a23-a755-86feb018450d",
            "carrierCode": "ESTAFETA",
            "carrierName": "Estafeta",
            "serviceCode": "express",
            "priceAmount": 260,
            "currency": "MXN",
            "deliveryDaysMin": 1,
            "deliveryDaysMax": 2,
            "pickupAvailable": true,
            "logoUrl": "https://api-pdog.softmena.dev/assets/logos/estafeta.png",
            "t_ms": 443
        }
    },
    {
        "type": "item",
        "data": {
            "uid": "fedex-express_saver:24b2bfe8-9f93-4a23-a755-86feb018450d",
            "carrierCode": "FEDEX",
            "carrierName": "FedEx",
            "serviceCode": "express_saver",
            "priceAmount": 270,
            "currency": "MXN",
            "deliveryDaysMin": 1,
            "deliveryDaysMax": 2,
            "pickupAvailable": true,
            "logoUrl": "https://api-pdog.softmena.dev/assets/logos/fedex.png",
            "t_ms": 566
        }
    },
    {
        "type": "end",
        "meta": {
            "count": 7,
            "partial": false,
            "errors": [] as any[]    
        }
    }
];