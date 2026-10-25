import React from "react";

export interface RateBenefit {
    text: string;
}

export interface RateTier {
    id: string;
    name: string;
    icon: React.ReactNode;
    iconWhite?: React.ReactNode;
    benefits: string[];
    footerText: string;
    isCurrent?: boolean;
    borderColor?: string;
}

export interface PreferentialRatesModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export interface PreferentialRatesHeaderProps {
    title: string;
    description: string;
}

export interface PreferentialRatesGridProps {
    tiers: RateTier[];
}

export interface PreferentialRatesCardProps {
    tier: RateTier;
}

export interface PreferentialRatesFooterProps {
    onContactSales: () => void;
}

export interface PreferentialRatesNoteProps {
    text: string;
}
