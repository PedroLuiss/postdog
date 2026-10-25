import React, { ReactNode } from "react";
import { CreditCard, Building2, Wallet, Store } from 'lucide-react';

export type PaymentMethodId = 'tarjeta' | 'spei' | 'paypal' | 'oxxo';

export interface PaymentMethod {
    id: PaymentMethodId;
    name: string;
    icon: ReactNode;
}

export interface AvailableMethod {
    type: string;
    label: string;
    enabled: boolean;
}

export interface PaymentConfigResponse {
    available_methods: AvailableMethod[];
    saved_cards: any[];
    currency: string;
    min_amount: number;
    publishable_key: string;
}


export interface DepositDetails {
    amount: number;
    commission: number;
    total: number;
}

export type BuyCreditsStep = 'amount' | 'payment';

export interface CardDetails {
    number: string;
    name: string;
    expiry: string;
    cvc: string;
}

export interface BuyCreditsFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContinue: (details: DepositDetails) => void;
}

export interface BuyCreditsCardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onBack: () => void;
    depositDetails: DepositDetails | null;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
    { id: 'tarjeta', name: 'Tarjeta', icon: React.createElement(CreditCard, { size: 20 }) },
    { id: 'spei', name: 'SPEI', icon: React.createElement(Building2, { size: 20 }) },
    { id: 'paypal', name: 'PayPal', icon: React.createElement(Wallet, { size: 20 }) },
    { id: 'oxxo', name: 'OXXO', icon: React.createElement(Store, { size: 20 }) },
];
