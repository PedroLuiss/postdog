
export const getStoreLogoUtils = (store?: string): string => {
    const logos: Record<string, string> = {
        'Shopify': 'https://cdn.worldvectorlogo.com/logos/shopify.svg',
        'Woocommerce': 'https://cdn.worldvectorlogo.com/logos/woocommerce.svg',
        'Postdog': 'https://cdn.worldvectorlogo.com/logos/postdog.svg'
    };

    return logos[store as string] || logos['Postdog'];
};