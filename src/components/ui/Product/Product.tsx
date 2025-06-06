import { FC, useMemo } from 'react';
import { TExtProductProjection, TIntrinsicDiv, TProductDiscount } from '../../../types/types';
import classNames from 'classnames';
import ProductDetails from '../ProductDetails/ProductDetails';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectLocale } from '../../../store/settingsSlice';
import { EntityState } from '@reduxjs/toolkit';
import { useProductVariant } from '../../../hooks/useProductVariant';
import { useSearchParams } from 'react-router';
import { VARIANT_PARAM_NAME } from '../ProductCard/ProductCard';
import ProductGallery from '../ProductGallery/ProductGallery';
import './Product.scss';
import { BLOCK } from '../../../constants/cssHelpers';

export const PRODUCT = 'product';
export const PRODUCT_DETAILS = `${PRODUCT}__details`;
export const PRODUCT_GALLERY = `${PRODUCT}__gallery`;

export type TProductProps = {
  productProjection: TExtProductProjection;
  discounts: EntityState<TProductDiscount, string>;
} & TIntrinsicDiv;

const Product: FC<TProductProps> = (props) => {
  const { className, productProjection, discounts, ...rest } = props;
  const classes = classNames(BLOCK, PRODUCT, className);
  const locale = useAppSelector(selectLocale);
  const { name, description, masterVariant, variants } = productProjection;
  const allVariants = useMemo(() => [masterVariant, ...variants], [masterVariant, variants]);
  const [params] = useSearchParams();
  const paramVariantId = Number(params.get(VARIANT_PARAM_NAME));

  const {
    images,
    isAvailable,
    localizedName,
    localizedDescription,
    currentPrice,
    discountDifference,
    currencyChar,
    isDiscounted,
    originalPrice,
    discountName,
    currentVariantId,
    handleVariantIdSetting,
  } = useProductVariant({
    paramVariantId,
    variants: allVariants,
    name,
    description,
    locale,
    discounts,
  });

  return (
    <article className={classes} {...rest}>
      <ProductGallery
        className={PRODUCT_GALLERY}
        sources={images}
        discountName={discountName}
        key={currentVariantId}
      />
      <ProductDetails
        variants={allVariants}
        className={PRODUCT_DETAILS}
        onVariantIdSetting={handleVariantIdSetting}
        isAvailable={isAvailable}
        localizedName={localizedName}
        localizedDescription={localizedDescription}
        currentPrice={currentPrice}
        discountDifference={discountDifference}
        currencyChar={currencyChar}
        isDiscounted={isDiscounted}
        originalPrice={originalPrice}
        currentVariantId={currentVariantId}
      />
    </article>
  );
};

export default Product;
