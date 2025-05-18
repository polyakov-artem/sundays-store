import { FC, ReactNode, useCallback, useMemo, useState } from 'react';
import { TImage, TIntrinsicDiv } from '../../../types/types';
import { MEDIA_CONTAIN } from '../../../constants/cssHelpers';
import classNames from 'classnames';
import ProductBadge from '../ProductBadge/ProductBadge';
import './ProductGallery.scss';

const PRODUCT_GALLERY = 'product-gallery';
const PRODUCT_GALLERY_VIEW = `${PRODUCT_GALLERY}__view`;
const PRODUCT_GALLERY_GRID = `${PRODUCT_GALLERY}__grid`;
const PRODUCT_GALLERY_GRID_ITEM = `${PRODUCT_GALLERY}__grid-item`;
const PRODUCT_GALLERY_GRID_ITEM_SELECTED = `${PRODUCT_GALLERY}__grid-item_selected`;
const PRODUCT_GALLERY_DISCOUNT_BADGE = `${PRODUCT_GALLERY}__discount-badge`;

export type TProductGalleryProps = {
  sources?: TImage[];
  discountName?: string;
} & TIntrinsicDiv;

const ProductGallery: FC<TProductGalleryProps> = (props) => {
  const { className, sources, discountName, ...rest } = props;

  const classes = classNames(PRODUCT_GALLERY, className);
  const [currentImgUrl, setCurrentImgUrl] = useState(sources?.[0]?.url || '');

  const handleImgClick = useCallback((url: string) => {
    setCurrentImgUrl(url);
  }, []);

  const imagesData = useMemo(() => {
    const result: Record<string, ReactNode> = {};

    sources?.forEach(({ url, label }) => {
      const element = <img src={url} alt={label || ''} key={url} className={MEDIA_CONTAIN} />;
      result[url] = element;
    });

    return result;
  }, [sources]);

  const currentImg = imagesData[currentImgUrl];

  const gridItems = useMemo(() => {
    return Object.entries(imagesData).map(([url, img]) => (
      <div
        className={classNames(PRODUCT_GALLERY_GRID_ITEM, {
          [PRODUCT_GALLERY_GRID_ITEM_SELECTED]: url === currentImgUrl,
        })}
        key={url}
        onClick={() => handleImgClick(url)}>
        {img}
      </div>
    ));
  }, [imagesData, handleImgClick, currentImgUrl]);

  return (
    <div className={classes} {...rest}>
      <div className={PRODUCT_GALLERY_VIEW}>
        <ProductBadge text={discountName} className={PRODUCT_GALLERY_DISCOUNT_BADGE} />
        {currentImg}
      </div>
      <div className={PRODUCT_GALLERY_GRID}>{gridItems}</div>
    </div>
  );
};

export default ProductGallery;
