import { FC } from 'react';
import Button from '../../shared/Button/Button';
import classNames from 'classnames';
import { BLOCK, H1, H3, MEDIA_CONTAIN } from '../../../constants/cssHelpers';
import imgSrc from './images/empty-cart.svg';
import { getFullPath } from '../../../utils/getFullPath';
import { VIEW_CATALOG } from '../../../constants/constants';
import { localizedAppStrings } from '../../../constants/localizedAppStrings';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectLocale } from '../../../store/settingsSlice';
import { AppStrings } from '../../../constants/appStrings';
import './EmptyCart.scss';

export const EMPTY_CART = 'empty-cart';
export const EMPTY_CART_IMG_WRAP = `${EMPTY_CART}__img-wrap`;
export const EMPTY_CART_IMG = `${EMPTY_CART}__img`;

const EmptyCart: FC = () => {
  const locale = useAppSelector(selectLocale);

  return (
    <section className={classNames(BLOCK, EMPTY_CART)}>
      <h1 className={H1}>{localizedAppStrings[locale][AppStrings.YourCartIsEmpty]}</h1>
      <div className={EMPTY_CART_IMG_WRAP}>
        <img src={imgSrc} alt="" className={classNames(MEDIA_CONTAIN, EMPTY_CART_IMG)} />
      </div>
      <p className={H3}>{localizedAppStrings[locale][AppStrings.looksLikeEmptyCart]}</p>
      <Button el="link" theme="primary" view="primary" to={getFullPath(VIEW_CATALOG)} rel="path">
        {localizedAppStrings[locale][AppStrings.ContinueShopping]}
      </Button>
    </section>
  );
};

export default EmptyCart;
