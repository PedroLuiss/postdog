import { QuoteFormData } from "../../../types";

export const isAddressComplete = (addr: any) => {
    return !!(
        addr?.street?.trim() &&
        addr?.zipCode?.trim() &&
        addr?.colony?.trim() &&
        addr?.city?.trim() &&
        addr?.state?.trim() &&
        addr?.fullName?.trim() &&
        addr?.phone?.trim() &&
        addr?.email?.trim()
    );
};


export const arePackagesComplete = (packages: any[]) => {
    return packages.length > 0 && packages.every(pkg =>
        pkg.length &&
        pkg.width &&
        pkg.height &&
        pkg.weight &&
        pkg.productTypeCode
    );
};

export const isQuotePackageComplete = (quote: QuoteFormData) => {
    return !!(
        quote.length &&
        quote.width &&
        quote.height &&
        quote.weight &&
        quote.productTypeCode
    );
};

export const isAddresseeCompleteForOrder = (addressee: any) => !!(
    addressee?.street?.trim() &&
    addressee?.internalNumber?.trim() &&
    addressee?.zipCode?.trim() &&
    addressee?.colony?.trim() &&
    addressee?.country?.trim() &&
    addressee?.fullName?.trim() &&
    addressee?.phone?.trim() &&
    addressee?.email?.trim()
);