import { FC, useCallback } from 'react';
import { TExtProductVariant, TIntrinsicDiv } from '../../../types/types';
import { H1 } from '../../../constants/cssHelpers';
import classNames from 'classnames';
import TabButtons from '../../shared/TabButtons/TabButtons';
import ProductPrice from '../ProductPrice/ProductPrice';
import ProductAvailability from '../ProductAvailability/ProductAvailability';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectLocale } from '../../../store/settingsSlice';
import { useParams, useSearchParams } from 'react-router';
import { VARIANT_PARAM_NAME } from '../ProductCard/ProductCard';
import PurchaseButtons from '../PurchaseButtons/PurchaseButtons';
import './ProductDetails.scss';

export const PRODUCT_DETAILS = 'product-details';
export const PRODUCT_DETAILS_NOT_AVAILABLE = `${PRODUCT_DETAILS}_not-available`;
export const PRODUCT_DETAILS_TITLE = `${PRODUCT_DETAILS}__title`;
export const PRODUCT_DETAILS_DESCRIPTION = `${PRODUCT_DETAILS}__description`;
export const PRODUCT_DETAILS_TABS = `${PRODUCT_DETAILS}__tabs`;
export const PRODUCT_DETAILS_PRICE = `${PRODUCT_DETAILS}__price`;
export const PRODUCT_DETAILS_PURCHASE_BUTTONS = `${PRODUCT_DETAILS}__purchase-buttons`;

export type TProductDetailsProps = {
  variants: TExtProductVariant[];
  isAvailable?: boolean;
  localizedName: string;
  localizedDescription: string;
  currentPrice: number;
  discountDifference: number;
  currencyChar: string;
  isDiscounted: boolean;
  originalPrice: number;
  currentVariantId: number;
  onVariantIdSetting: (id: number) => void;
} & TIntrinsicDiv;

const ProductDetails: FC<TProductDetailsProps> = (props) => {
  const {
    className,
    variants,
    isAvailable,
    localizedName,
    localizedDescription,
    currentPrice,
    discountDifference,
    currencyChar,
    isDiscounted,
    currentVariantId,
    originalPrice,
    onVariantIdSetting,
    ...rest
  } = props;

  const classes = classNames(
    PRODUCT_DETAILS,
    { [PRODUCT_DETAILS_NOT_AVAILABLE]: !isAvailable },
    className
  );

  const locale = useAppSelector(selectLocale);
  const [_params, setParams] = useSearchParams();
  const { productId = '' } = useParams();

  const handleTabBtnClick = useCallback(
    (id: number) => {
      if (currentVariantId === id) {
        return;
      }

      onVariantIdSetting(id);
      setParams(
        (prev) => {
          prev.set(VARIANT_PARAM_NAME, `${id}`);
          return prev;
        },
        { replace: true }
      );
    },
    [currentVariantId, onVariantIdSetting, setParams]
  );

  return (
    <div className={classes} {...rest}>
      <h1 className={classNames(H1, PRODUCT_DETAILS_TITLE)}>{localizedName}</h1>
      <p className={PRODUCT_DETAILS_DESCRIPTION}>{localizedDescription}</p>

      {variants.length > 1 && (
        <TabButtons
          className={PRODUCT_DETAILS_TABS}
          items={variants}
          nameProp="sku"
          valueProp="id"
          selectedValue={currentVariantId}
          onTabBtnClick={handleTabBtnClick}
        />
      )}
      <ProductPrice
        className={PRODUCT_DETAILS_PRICE}
        originalPrice={originalPrice}
        currentPrice={currentPrice}
        discountDifference={discountDifference}
        currencyChar={currencyChar}
        isDiscounted={isDiscounted}
      />
      <PurchaseButtons
        className={PRODUCT_DETAILS_PURCHASE_BUTTONS}
        disabled={!isAvailable}
        productId={productId}
        variantId={currentVariantId}
        key={currentVariantId}
      />
      <ProductAvailability isAvailable={isAvailable} locale={locale} />
    </div>
  );
};

export default ProductDetails;
