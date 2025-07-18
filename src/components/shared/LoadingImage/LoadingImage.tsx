import { useState, FC, useEffect, useRef, useMemo, memo } from 'react';
import { TIntrinsicDiv } from '../../../types/types';
import { getClasses } from '../../../utils/getClasses';
import ScreenLoader from '../ScreenLoader/ScreenLoader';
import classNames from 'classnames';
import { MEDIA_CONTAIN, MEDIA_COVER } from '../../../constants/cssHelpers';
import './LoadingImage.scss';

export type TLoadingImageProps = TIntrinsicDiv & {
  src?: string;
  alt?: string;
  contain?: boolean;
};

export const LOADING_IMG = 'loading-image';
export const LOADING_IMG_SPINNER = `${LOADING_IMG}__spinner`;
export const LOADING_IMG_IMAGE = `${LOADING_IMG}__image`;
export const LOADING_IMG_IMAGE_IS_LOADING = `${LOADING_IMG}__image_is-loading`;

const LoadingImage: FC<TLoadingImageProps> = (props) => {
  const { className, src, alt, children, contain, ...restProps } = props;
  const classes = getClasses(LOADING_IMG, className);
  const [imgIsLoading, setImgIsLoading] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const imgElem = imgRef.current;
    const handleImgLoading = () => {
      setImgIsLoading(false);
    };
    imgElem?.addEventListener('load', handleImgLoading);

    return () => imgElem?.removeEventListener('load', handleImgLoading);
  }, []);

  useEffect(() => setImgIsLoading(true), [src]);

  const imgClasses = useMemo(
    () =>
      classNames(LOADING_IMG_IMAGE, {
        [LOADING_IMG_IMAGE_IS_LOADING]: imgIsLoading,
        [contain ? MEDIA_CONTAIN : MEDIA_COVER]: true,
      }),
    [contain, imgIsLoading]
  );

  return (
    <div {...restProps} className={classes}>
      <img ref={imgRef} className={imgClasses} src={src} alt={alt || ''} />
      {imgIsLoading && <ScreenLoader className={LOADING_IMG_SPINNER} type="linear" fullSpace />}
      {children}
    </div>
  );
};

export default memo(LoadingImage);
