import { useState, useMemo, useEffect } from 'react';
import { PaymentMethodId, DepositDetails, BuyCreditsStep, CardDetails, AvailableMethod } from '../types/buy-credits.type';
import { loadStripe, Stripe } from '@stripe/stripe-js';
import PaymentService from '../../../../../services/paymentService';

export const useBuyCreditsForm = () => {
    const [step, setStep] = useState<BuyCreditsStep>('amount');
    const [selectedMethod, setSelectedMethod] = useState<PaymentMethodId>('tarjeta');
    const [amount, setAmount] = useState<string>('');
    const [cardDetails, setCardDetails] = useState<CardDetails>({
        number: '',
        name: '',
        expiry: '',
        cvc: ''
    });

    const [availableMethods, setAvailableMethods] = useState<AvailableMethod[]>([]);
    const [isConfigLoading, setIsLoading] = useState<boolean>(true);

    const [stripePromise, setStripePromise] = useState<Promise<Stripe | null> | null>(null);
    const [clientSecret, setClientSecret] = useState<string | undefined>(undefined);
    const [isIntentLoading, setIsIntentLoading] = useState<boolean>(false);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                setIsLoading(true);
                const response = await PaymentService.getConfig();
                setAvailableMethods(response.available_methods || []);
                if (response.publishable_key) {
                    setStripePromise(loadStripe(response.publishable_key));
                }
            } catch (error) {
                console.error("Error loading payment configuration", error);
                setAvailableMethods([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchConfig();
    }, []);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        if (val === '' || /^\d*$/.test(val)) {
            setAmount(val);
        }
    };

    const handleAmountBlur = () => {
        if (amount !== '' && parseInt(amount) < 100) {
            setAmount('100');
        }
    };

    const incrementAmount = () => {
        const current = amount === '' ? 0 : parseInt(amount);
        if (current < 100) {
            setAmount('100');
        } else {
            setAmount((current + 1).toString());
        }
    };

    const decrementAmount = () => {
        const current = amount === '' ? 0 : parseInt(amount);
        if (current <= 100) {
            setAmount('100');
        } else {
            setAmount((current - 1).toString());
        }
    };

    const handleCardChange = (field: keyof CardDetails) => (e: React.ChangeEvent<HTMLInputElement>) => {
        setCardDetails(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const depositDetails = useMemo<DepositDetails | null>(() => {
        if (amount.length < 3) return null;
        const numAmount = parseFloat(amount);
        if (isNaN(numAmount)) return null;

        let commission = 0;
        if (selectedMethod === 'paypal') {
            commission = (numAmount * 0.0302) + 4.64;
        } else {
            commission = (numAmount * 0.036) + 3;
        }

        const total = numAmount - commission;

        return {
            amount: numAmount,
            commission,
            total
        };
    }, [amount, selectedMethod]);

    const isAmountButtonDisabled = amount.length < 3 || isIntentLoading;
    const isCardButtonDisabled = !cardDetails.number || !cardDetails.name || !cardDetails.expiry || !cardDetails.cvc;

    const goToPayment = async () => {
        if (!amount || isAmountButtonDisabled) return;

        setIsIntentLoading(true);
        try {
            const parsedAmount = parseFloat(amount);
            const response = await PaymentService.createPaymentIntent({
                amount: parsedAmount,
                currency: 'MXN',
            });

            const rawData = response.data as any;
            const secret = rawData?.client_secret || rawData?.data?.client_secret || rawData?.data?.clientSecret;

            if (secret) {
                setClientSecret(secret);
                setStep('payment');
            } else {
                throw new Error("No client secret received");
            }
        } catch (error) {
            console.error("Failed to create payment intent", error);
        } finally {
            setIsIntentLoading(false);
        }
    };

    const goBack = () => setStep('amount');

    const resetBuyCreditsForm = () => {
        setStep('amount');
        setAmount('');
        setClientSecret(undefined);
    };

    const elementsOptions = useMemo(() => {
        if (!clientSecret) return undefined;
        
        return {
            clientSecret,
            appearance: {
                theme: 'stripe' as const,
                variables: {
                    colorPrimary: '#DC2626',
                    colorBackground: '#ffffff',
                    colorText: '#333333',
                    colorDanger: '#DC2626',
                    fontFamily: 'Inter, "Open Sans", system-ui, sans-serif',
                    spacingUnit: '4px',
                    borderRadius: '0.375rem',
                },
                rules: {
                    '.Tab': {
                        border: '1px solid #E0E6EB',
                        boxShadow: 'none',
                    },
                    '.Tab:hover': {
                        border: '1px solid #DC2626',
                    },
                    '.Tab--selected': {
                        borderColor: '#DC2626',
                        color: '#333333',
                    },
                }
            },
            locale: 'es-419' as const
        };
    }, [clientSecret]);

    const amountButtonText = selectedMethod === 'oxxo' ? 'Generar referencia OXXO' : 'Continuar';

    return {
        step,
        selectedMethod,
        setSelectedMethod,
        amount,
        handleAmountChange,
        handleAmountBlur,
        incrementAmount,
        decrementAmount,
        depositDetails,
        isAmountButtonDisabled,
        isCardButtonDisabled,
        cardDetails,
        handleCardChange,
        goToPayment,
        goBack,
        resetBuyCreditsForm,
        amountButtonText,
        availableMethods,
        isConfigLoading,
        stripePromise,
        clientSecret,
        isIntentLoading,
        elementsOptions
    };
};
