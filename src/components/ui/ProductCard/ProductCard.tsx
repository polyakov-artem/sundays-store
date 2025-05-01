import { FC, useCallback, useMemo } from 'react';
import { TIntrinsicArticle, TProductProjection } from '../../../types/types';
import classNames from 'classnames';
import { BLOCK, BLOCK_WITH_HOVER, H3, H4, MEDIA_CONTAIN } from '../../../constants/cssHelpers';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectCountryCode, selectLocale } from '../../../store/settingsSlice';
import { getFullPath } from '../../../utils/getFullPath';
import { VIEW_LOGIN, VIEW_PRODUCT } from '../../../routes';
import { Link, useLocation, useNavigate } from 'react-router';
import { getLocalizedPriceData } from '../../../utils/getLocalizedPriceData';
import { localizedAppStrings } from '../../../constants/localizedAppStrings';
import { AppStrings } from '../../../constants/appStrings';
import Button from '../../shared/Button/Button';
import { FaShoppingCart } from 'react-icons/fa';
import { selectUserRole } from '../../../store/authSlice';
import { TokenRole } from '../../../services/authService';
import { selectGetProductDiscountsAdapterState } from '../../../store/storeApi';
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

export const DESCRIPTION_MAX_LENGTH = 120;

export type TProductCardProps = {
  product: TProductProjection;
  isListMode: boolean;
} & TIntrinsicArticle;

const ProductCard: FC<TProductCardProps> = (props) => {
  const { className, product, isListMode, ...rest } = props;
  const {
    id,
    name,
    description,
    masterVariant: { images, availability, prices },
  } = product;

  const isAvailable = availability?.isOnStock;
  const classes = classNames(
    BLOCK,
    BLOCK_WITH_HOVER,
    PRODUCT_CARD,
    { [PRODUCT_CARD_NOT_AVAILABLE]: !isAvailable, [PRODUCT_CARD_MODE_LIST]: isListMode },
    className
  );

  const locale = useAppSelector(selectLocale);
  const countryCode = useAppSelector(selectCountryCode);
  const discounts = useAppSelector(selectGetProductDiscountsAdapterState);
  const localizedName = name[locale];
  const role = useAppSelector(selectUserRole);
  const navigate = useNavigate();
  const location = useLocation();

  const localizedPriceData = useMemo(() => {
    return getLocalizedPriceData(countryCode, prices);
  }, [prices, countryCode]);

  const truncatedDescription = useMemo(() => {
    if (!description) return;

    const localized = description[locale];
    if (localized.length <= DESCRIPTION_MAX_LENGTH) return localized;

    return `${localized.slice(0, DESCRIPTION_MAX_LENGTH)}...`;
  }, [locale, description]);

  const linkURL = getFullPath(VIEW_PRODUCT, id);

  let pricesContent;

  if (localizedPriceData) {
    const { discountedValue, discountDifference, value, currencyChar } = localizedPriceData;

    const actualPriceValue = discountedValue ? discountedValue : value;

    const actualPrice = (
      <div className={classNames(H3, PRODUCT_CARD_ACTUAL_PRICE)}>
        <span className={PRODUCT_CARD_PRICE}>{actualPriceValue}</span>
        <span className={PRODUCT_CARD_CURRENCY_CHAR}>{` ${currencyChar}`}</span>
      </div>
    );

    if (discountedValue) {
      pricesContent = (
        <>
          <div className={PRODUCT_CARD_DISCOUNT_PRICE}>
            <span className={PRODUCT_CARD_OLD_PRICE}>
              <span className={PRODUCT_CARD_PRICE}>{value}</span>
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
  }

  const discountBadgeText = localizedPriceData?.discountId
    ? discounts.entities[localizedPriceData.discountId]?.name[locale]
    : '';

  const discountBadge = discountBadgeText ? (
    <p className={PRODUCT_CARD_DISCOUNT_BADGE}>{discountBadgeText}</p>
  ) : null;

  const handleBuyBtnClick = useCallback(() => {
    if (!isAvailable) return;

    if (role !== TokenRole.user) {
      void navigate(getFullPath(VIEW_LOGIN), {
        replace: true,
        state: { from: location },
        relative: 'path',
      });
    }
  }, [role, location, navigate, isAvailable]);

  return (
    <article className={classes} {...rest}>
      <header className={PRODUCT_CARD_HEADER}>
        <Link className={PRODUCT_CARD_LINK} to={linkURL}>
          <div className={PRODUCT_CARD_IMG_WRAP}>
            <img
              className={classNames(MEDIA_CONTAIN, PRODUCT_CARD_IMG)}
              src={images?.[0].url}
              alt={localizedName}
            />
            {discountBadge}
          </div>
        </Link>
      </header>
      <div className={PRODUCT_CARD_BODY}>
        <Link className={PRODUCT_CARD_LINK} to={linkURL}>
          <h4 className={classNames(H4, PRODUCT_CARD_TITLE)}> {localizedName}</h4>
        </Link>
        <p className={PRODUCT_CARD_DESCRIPTION}>{truncatedDescription}</p>
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
