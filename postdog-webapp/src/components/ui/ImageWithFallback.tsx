import React, { useState, useEffect } from 'react';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string;
    fallbackSrc: string;
    alt: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
    src,
    fallbackSrc,
    alt,
    ...rest
}) => {
    const [currentSrc, setCurrentSrc] = useState(src);
    useEffect(() => {
        setCurrentSrc(src);
    }, [src]);

    const handleError = () => {
        setCurrentSrc(fallbackSrc);
    };

    return (
        <img
            src={currentSrc}
            alt={alt}
            loading="lazy"      
            onError={handleError} 
            {...rest}            
        />
    );
};