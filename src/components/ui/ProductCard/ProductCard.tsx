import { FC, useMemo } from 'react';
import {
  CountryLocale,
  Order,
  TExtProductProjection,
  TIntrinsicArticle,
  TProductDiscount,
} from '../../../types/types';
import classNames from 'classnames';
import { BLOCK, BLOCK_WITH_HOVER, H4 } from '../../../constants/cssHelpers';
import { getFullPath } from '../../../utils/getFullPath';
import { VIEW_PRODUCT } from '../../../constants/constants';
import { Link } from 'react-router';
import { localizedAppStrings } from '../../../constants/localizedAppStrings';
import { AppStrings } from '../../../constants/appStrings';
import Button from '../../shared/Button/Button';
import { FaShoppingCart } from 'react-icons/fa';
import LoadingImage from '../../shared/LoadingImage/LoadingImage';
import ProductPrice from '../ProductPrice/ProductPrice';
import { TRedirectUnauthorized } from '../../../hooks/useRedirectionOfUnauthorized';
import TabButtons from '../../shared/TabButtons/TabButtons';
import ProductAvailability from '../ProductAvailability/ProductAvailability';
import { EntityState } from '@reduxjs/toolkit';
import { useProductVariant } from '../../../hooks/useProductVariant';
import ProductBadge from '../ProductBadge/ProductBadge';
import './ProductCard.scss';

export const PRODUCT_CARD = 'product-card';
export const PRODUCT_CARD_MODE_LIST = `${PRODUCT_CARD}_mode_list`;
export const PRODUCT_CARD_NOT_AVAILABLE = `${PRODUCT_CARD}_not-available`;
export const PRODUCT_CARD_LINK = `${PRODUCT_CARD}__link`;
export const PRODUCT_CARD_HEADER = `${PRODUCT_CARD}__header`;
export const PRODUCT_CARD_BODY = `${PRODUCT_CARD}__body`;
export const PRODUCT_CARD_TITLE = `${PRODUCT_CARD}__title`;
export const PRODUCT_CARD_IMG = `${PRODUCT_CARD}__img`;
export const PRODUCT_CARD_DESCRIPTION = `${PRODUCT_CARD}__description`;
export const PRODUCT_CARD_PRICE = `${PRODUCT_CARD}__price`;
export const PRODUCT_CARD_ACTIONS = `${PRODUCT_CARD}__actions`;
export const PRODUCT_CARD_ACTION_BTN = `${PRODUCT_CARD}__action-btn`;
export const PRODUCT_CARD_DISCOUNT_BADGE = `${PRODUCT_CARD}__discount-badge`;
export const PRODUCT_CARD_TABS = `${PRODUCT_CARD}__tabs`;

export const DESCRIPTION_MAX_LENGTH = 120;
export const VARIANT_PARAM_NAME = 'var-id';

export type TProductCardProps = {
  productProjection: TExtProductProjection;
  isListMode: boolean;
  priceSorting?: Order;
  locale: CountryLocale;
  categoryId?: string;
  discounts: EntityState<TProductDiscount, string>;
  redirectUnauthorized: TRedirectUnauthorized;
} & TIntrinsicArticle;

const ProductCard: FC<TProductCardProps> = (props) => {
  const {
    className,
    productProjection,
    priceSorting,
    isListMode,
    locale,
    categoryId,
    discounts,
    redirectUnauthorized,
    ...rest
  } = props;

  const { id, masterVariant, variants, name, description } = productProjection;

  const matchedVariants = useMemo(
    () => [masterVariant, ...variants].filter((variant) => variant.isMatchingVariant),
    [masterVariant, variants]
  );

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
    handleBuyBtnClick,
    handleVariantIdSetting,
  } = useProductVariant({
    variants: matchedVariants,
    name,
    description,
    priceSorting,
    locale,
    discounts,
    redirectUnauthorized,
  });

  const classes = classNames(
    BLOCK,
    BLOCK_WITH_HOVER,
    PRODUCT_CARD,
    { [PRODUCT_CARD_NOT_AVAILABLE]: !isAvailable, [PRODUCT_CARD_MODE_LIST]: isListMode },
    className
  );

  const truncatedDescription = useMemo(() => {
    if (localizedDescription.length <= DESCRIPTION_MAX_LENGTH) return localizedDescription;

    return `${localizedDescription.slice(0, DESCRIPTION_MAX_LENGTH)}...`;
  }, [localizedDescription]);

  const linkURL = getFullPath(
    VIEW_PRODUCT,
    `${categoryId}/${id}/?${VARIANT_PARAM_NAME}=${currentVariantId}`
  );

  return (
    <article className={classes} {...rest}>
      <header className={PRODUCT_CARD_HEADER}>
        <LoadingImage
          src={images?.[0].url}
          alt={localizedName}
          className={PRODUCT_CARD_IMG}
          contain>
          <ProductBadge text={discountName} className={PRODUCT_CARD_DISCOUNT_BADGE} />
        </LoadingImage>
      </header>
      <div className={PRODUCT_CARD_BODY}>
        <Link className={PRODUCT_CARD_LINK} to={linkURL}>
          <h4 className={classNames(H4, PRODUCT_CARD_TITLE)}> {localizedName}</h4>
        </Link>
        <p className={PRODUCT_CARD_DESCRIPTION}>{truncatedDescription}</p>
        {matchedVariants.length > 1 && (
          <TabButtons
            className={PRODUCT_CARD_TABS}
            items={matchedVariants}
            nameProp="sku"
            valueProp="id"
            selectedValue={currentVariantId}
            onTabBtnClick={handleVariantIdSetting}
          />
        )}
        <ProductPrice
          className={PRODUCT_CARD_PRICE}
          originalPrice={originalPrice}
          currentPrice={currentPrice}
          discountDifference={discountDifference}
          currencyChar={currencyChar}
          isDiscounted={isDiscounted}
        />
        <div className={PRODUCT_CARD_ACTIONS}>
          <Button
            el="link"
            view="primary"
            theme="primary"
            text={localizedAppStrings[locale][AppStrings.Details]}
            size="sm"
            to={linkURL}
            relative="path"
            className={PRODUCT_CARD_ACTION_BTN}
          />
          <Button
            el="button"
            view="primary"
            theme="primary"
            icon={<FaShoppingCart />}
            text={localizedAppStrings[locale][AppStrings.AddToCart]}
            size="sm"
            onClick={handleBuyBtnClick}
            iconBefore
            className={PRODUCT_CARD_ACTION_BTN}
            disabled={!isAvailable}
          />
        </div>
        <ProductAvailability isAvailable={isAvailable} locale={locale} />
      </div>
    </article>
  );
};

export default ProductCard;
