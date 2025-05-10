import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  CountryCode,
  CountryLocale,
  Order,
  TExtProductProjection,
  TIntrinsicArticle,
} from '../../../types/types';
import classNames from 'classnames';
import { BLOCK, BLOCK_WITH_HOVER, H3, H4, MEDIA_CONTAIN } from '../../../constants/cssHelpers';
import { useAppSelector } from '../../../hooks/store-hooks';
import { getFullPath } from '../../../utils/getFullPath';
import { VIEW_LOGIN, VIEW_PRODUCT } from '../../../routes';
import { Link, Location, useNavigate } from 'react-router';
import { localizedAppStrings } from '../../../constants/localizedAppStrings';
import { AppStrings } from '../../../constants/appStrings';
import Button from '../../shared/Button/Button';
import { FaShoppingCart } from 'react-icons/fa';
import { TokenRole } from '../../../services/authService';
import { selectGetProductDiscountsAdapterState } from '../../../store/storeApi';
import ScreenLoader from '../../shared/ScreenLoader/ScreenLoader';
import './ProductCard.scss';

export const PRODUCT_CARD = 'product-card';
export const PRODUCT_CARD_MODE_LIST = `${PRODUCT_CARD}_mode_list`;
export const PRODUCT_CARD_NOT_AVAILABLE = `${PRODUCT_CARD}_not-available`;
export const PRODUCT_CARD_LINK = `${PRODUCT_CARD}__link`;
export const PRODUCT_CARD_HEADER = `${PRODUCT_CARD}__header`;
export const PRODUCT_CARD_BODY = `${PRODUCT_CARD}__body`;
export const PRODUCT_CARD_TITLE = `${PRODUCT_CARD}__title`;
export const PRODUCT_CARD_IMG_WRAP = `${PRODUCT_CARD}__img-wrap`;
export const PRODUCT_CARD_IMG = `${PRODUCT_CARD}__img`;
export const PRODUCT_CARD_DESCRIPTION = `${PRODUCT_CARD}__description`;
export const PRODUCT_CARD_ACTIONS = `${PRODUCT_CARD}__actions`;
export const PRODUCT_CARD_ACTION_BTN = `${PRODUCT_CARD}__action-btn`;
export const PRODUCT_CARD_PRICES = `${PRODUCT_CARD}__prices`;
export const PRODUCT_CARD_PRICE = `${PRODUCT_CARD}__price`;
export const PRODUCT_CARD_CURRENCY_CHAR = `${PRODUCT_CARD}__currency-char`;
export const PRODUCT_CARD_ACTUAL_PRICE = `${PRODUCT_CARD}__actual-price`;
export const PRODUCT_CARD_OLD_PRICE = `${PRODUCT_CARD}__old-price`;
export const PRODUCT_CARD_DISCOUNT_PRICE = `${PRODUCT_CARD}__discount-price`;
export const PRODUCT_CARD_DISCOUNT_VALUE = `${PRODUCT_CARD}__discount-value`;
export const PRODUCT_CARD_AVAILABILITY = `${PRODUCT_CARD}__availability`;
export const PRODUCT_CARD_AVAILABILITY_VALUE = `${PRODUCT_CARD}__availability-value`;
export const PRODUCT_CARD_DISCOUNT_BADGE = `${PRODUCT_CARD}__discount-badge`;
export const PRODUCT_CARD_TABS = `${PRODUCT_CARD}__tabs`;
export const PRODUCT_CARD_IMG_IS_LOADING = `${PRODUCT_CARD}__img_is-loading`;
export const PRODUCT_CARD_IMG_LOADER = `${PRODUCT_CARD}__img-loader`;

export const DESCRIPTION_MAX_LENGTH = 120;

export type TProductCardProps = {
  productProjection: TExtProductProjection;
  isListMode: boolean;
  priceSorting?: Order;
  countryCode: CountryCode;
  locale: CountryLocale;
  location: Location;
  role: TokenRole;
} & TIntrinsicArticle;

const ProductCard: FC<TProductCardProps> = (props) => {
  const {
    className,
    productProjection,
    priceSorting,
    isListMode,
    locale,
    location,
    role,
    countryCode,
    ...rest
  } = props;

  const navigate = useNavigate();
  const discounts = useAppSelector(selectGetProductDiscountsAdapterState);
  const { id, name, description, masterVariant, variants } = productProjection;
  const imgRef = useRef<HTMLImageElement>(null);
  const [imgIsLoading, setImgIsLoading] = useState(true);

  const matchedVariants = useMemo(() => {
    return [masterVariant, ...variants].filter((variant) => variant.isMatchingVariant);
  }, [masterVariant, variants]);

  const defaultVariantIndex = useMemo(() => {
    let index = 0;

    if (priceSorting) {
      matchedVariants.forEach((variant, i) => {
        const foundValue = matchedVariants[index].scopedPrice.currentValue.centAmount;
        const variantValue = variant.scopedPrice.currentValue.centAmount;

        if (foundValue && variantValue) {
          if (priceSorting === Order.asc) {
            if (foundValue > variantValue) {
              index = i;
            }
          } else {
            if (foundValue < variantValue) {
              index = i;
            }
          }
        }
      });
    }

    return index;
  }, [matchedVariants, priceSorting]);

  const [currentVariantIndex, setCurrentVariantIndex] = useState(defaultVariantIndex);
  const currentVariant = matchedVariants[currentVariantIndex];

  const { images, availability, priceData } = currentVariant;
  const isAvailable = availability?.isOnStock;

  const classes = classNames(
    BLOCK,
    BLOCK_WITH_HOVER,
    PRODUCT_CARD,
    { [PRODUCT_CARD_NOT_AVAILABLE]: !isAvailable, [PRODUCT_CARD_MODE_LIST]: isListMode },
    className
  );

  const localizedName = name[locale];

  const truncatedDescription = useMemo(() => {
    if (!description) return;

    const localized = description[locale];
    if (localized.length <= DESCRIPTION_MAX_LENGTH) return localized;

    return `${localized.slice(0, DESCRIPTION_MAX_LENGTH)}...`;
  }, [locale, description]);

  const {
    currentPrice,
    discountDifference,
    discountId,
    currencyChar,
    isDiscounted,
    originalPrice,
  } = priceData || {};
  const hasIncorrectPrice = !currentPrice;

  let pricesContent;

  const actualPrice = (
    <div className={classNames(H3, PRODUCT_CARD_ACTUAL_PRICE)}>
      <span className={PRODUCT_CARD_PRICE}>{currentPrice}</span>
      <span className={PRODUCT_CARD_CURRENCY_CHAR}>{` ${currencyChar}`}</span>
    </div>
  );

  if (isDiscounted) {
    pricesContent = (
      <>
        <div className={PRODUCT_CARD_DISCOUNT_PRICE}>
          <span className={PRODUCT_CARD_OLD_PRICE}>
            <span className={PRODUCT_CARD_PRICE}>{originalPrice}</span>
            <span className={PRODUCT_CARD_CURRENCY_CHAR}>{` ${currencyChar}`}</span>
          </span>
          <span className={PRODUCT_CARD_DISCOUNT_VALUE}>{discountDifference}</span>
        </div>
        {actualPrice}
      </>
    );
  } else {
    pricesContent = actualPrice;
  }

  const discountBadgeText = discountId ? discounts.entities[discountId]?.name[locale] : '';

  const discountBadge = discountBadgeText ? (
    <p className={PRODUCT_CARD_DISCOUNT_BADGE}>{discountBadgeText}</p>
  ) : null;

  const handleBuyBtnClick = useCallback(() => {
    if (!isAvailable || hasIncorrectPrice) return;

    if (role !== TokenRole.user) {
      void navigate(getFullPath(VIEW_LOGIN), {
        replace: true,
        state: { from: location },
        relative: 'path',
      });
    }
  }, [role, location, navigate, isAvailable, hasIncorrectPrice]);

  const linkURL = getFullPath(VIEW_PRODUCT, `${id}-${currentVariant.id}`);

  const tabsContent = useMemo(() => {
    return matchedVariants.map((variant, i) => (
      <Button
        el="button"
        key={variant.id}
        theme="primary"
        view="tab"
        size="sm"
        onClick={() => {
          setCurrentVariantIndex(i);
          setImgIsLoading(true);
        }}
        selected={i === currentVariantIndex}>
        {variant.sku}
      </Button>
    ));
  }, [matchedVariants, currentVariantIndex]);

  useEffect(() => {
    const imgElem = imgRef.current;
    const handleImgLoading = () => {
      setImgIsLoading(false);
    };
    imgElem?.addEventListener('load', handleImgLoading);

    return () => imgElem?.removeEventListener('load', handleImgLoading);
  }, []);

  return (
    <article className={classes} {...rest}>
      <header className={PRODUCT_CARD_HEADER}>
        <div className={PRODUCT_CARD_IMG_WRAP}>
          {imgIsLoading && (
            <ScreenLoader className={PRODUCT_CARD_IMG_LOADER} type="linear" fullSpace />
          )}
          <img
            ref={imgRef}
            className={classNames(MEDIA_CONTAIN, PRODUCT_CARD_IMG, {
              [PRODUCT_CARD_IMG_IS_LOADING]: imgIsLoading,
            })}
            src={images?.[0].url}
            alt={localizedName}
          />
          {discountBadge}
        </div>
      </header>
      <div className={PRODUCT_CARD_BODY}>
        <Link className={PRODUCT_CARD_LINK} to={linkURL}>
          <h4 className={classNames(H4, PRODUCT_CARD_TITLE)}> {localizedName}</h4>
        </Link>
        <p className={PRODUCT_CARD_DESCRIPTION}>{truncatedDescription}</p>
        <div className={PRODUCT_CARD_TABS}>{tabsContent.length > 1 && tabsContent}</div>
        <div className={PRODUCT_CARD_PRICES}>{pricesContent}</div>
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
            text={localizedAppStrings[locale][AppStrings.Buy]}
            size="sm"
            onClick={handleBuyBtnClick}
            iconBefore
            className={PRODUCT_CARD_ACTION_BTN}
            disabled={!isAvailable}
          />
        </div>

        <p className={PRODUCT_CARD_AVAILABILITY}>
          {localizedAppStrings[locale][AppStrings.IsOnStock]}:{' '}
          <span
            className={
              PRODUCT_CARD_AVAILABILITY_VALUE
            }>{`${isAvailable ? localizedAppStrings[locale][AppStrings.Yes] : localizedAppStrings[locale][AppStrings.No]}`}</span>
        </p>
      </div>
    </article>
  );
};

export default ProductCard;
