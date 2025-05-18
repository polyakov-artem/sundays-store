import { FC, useCallback } from 'react';
import { TExtProductVariant, TIntrinsicDiv } from '../../../types/types';
import { H1 } from '../../../constants/cssHelpers';
import classNames from 'classnames';
import Button from '../../shared/Button/Button';
import { FaShoppingCart } from 'react-icons/fa';
import { localizedAppStrings } from '../../../constants/localizedAppStrings';
import { AppStrings } from '../../../constants/appStrings';
import TabButtons from '../../shared/TabButtons/TabButtons';
import ProductPrice from '../ProductPrice/ProductPrice';
import ProductAvailability from '../ProductAvailability/ProductAvailability';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectLocale } from '../../../store/settingsSlice';
import { useSearchParams } from 'react-router';
import { VARIANT_PARAM_NAME } from '../ProductCard/ProductCard';
import './ProductDetails.scss';

const PRODUCT_DETAILS = 'product-details';
const PRODUCT_DETAILS_NOT_AVAILABLE = `${PRODUCT_DETAILS}_not-available`;
const PRODUCT_DETAILS_TITLE = `${PRODUCT_DETAILS}__title`;
const PRODUCT_DETAILS_DESCRIPTION = `${PRODUCT_DETAILS}__description`;
const PRODUCT_DETAILS_TABS = `${PRODUCT_DETAILS}__tabs`;
const PRODUCT_DETAILS_PRICE = `${PRODUCT_DETAILS}__price`;
const PRODUCT_DETAILS_ACTIONS = `${PRODUCT_DETAILS}__actions`;

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
  onBuyBtnClick: VoidFunction;
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
    onBuyBtnClick,
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
      <div className={PRODUCT_DETAILS_ACTIONS}>
        <Button
          el="button"
          view="primary"
          theme="primary"
          icon={<FaShoppingCart />}
          text={localizedAppStrings[locale][AppStrings.Buy]}
          size="sm"
          onClick={onBuyBtnClick}
          iconBefore
          disabled={!isAvailable}
        />
      </div>
      <ProductAvailability isAvailable={isAvailable} locale={locale} />
    </div>
  );
};

export default ProductDetails;
