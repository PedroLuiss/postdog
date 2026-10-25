import { forwardRef } from 'react';
import styles from './ImgUi.module.scss';
import noImage from '../../../assets/img/no_image.svg';
import { DEFAULT_LOADER } from './constant/ImgUi.constant';
import { ImgUiProps } from './types';
import { useImgUi } from './hooks/useImgUi';

export const ImgUi = forwardRef<HTMLImageElement, ImgUiProps>((props, ref) => {
  const {
    src,
    alt,
    className = '',
    loaderSrc = DEFAULT_LOADER,
    errorSrc = noImage,
    onLoad,
    onError,
    ...rest
  } = props;

  const { 
    status, 
    setRefs, 
    handleLoad, 
    handleError 
  } = useImgUi({ src, onLoad, onError, ref });

  return (
      <>
        {status === 'loading' && (
            <img 
            src={loaderSrc} 
            alt="Cargando..." 
            className={styles['img-ui__loader-gif']} 
            />
        )}

        {status === 'error' && (
            <img 
            src={errorSrc} 
            alt="Error al cargar" 
            className={`${styles['img-ui__error-img']} ${className}`}
            />
        )}

        <img
            ref={setRefs}
            src={src}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={`
            ${styles['img-ui__media']} 
            ${status === 'loaded' ? styles['img-ui__media--visible'] : styles['img-ui__media--hidden']}
            ${className}
            `}
            {...rest}
        />
      </>
  );
});

ImgUi.displayName = 'ImgUi';