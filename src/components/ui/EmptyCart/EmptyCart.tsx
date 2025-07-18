import { FC, memo } from 'react';
import Button from '../../shared/Button/Button';
import classNames from 'classnames';
import { BLOCK, H1, H3, MEDIA_CONTAIN } from '../../../constants/cssHelpers';
import imgSrc from './images/empty-cart.svg';
import { getFullPath } from '../../../utils/getFullPath';
import { VIEW_CATALOG } from '../../../constants/constants';
import { I18nKey } from '../../../utils/i18n/i18nKey';
import { useTranslation } from 'react-i18next';
import './EmptyCart.scss';

export const EMPTY_CART = 'empty-cart';
export const EMPTY_CART_IMG_WRAP = `${EMPTY_CART}__img-wrap`;
export const EMPTY_CART_IMG = `${EMPTY_CART}__img`;

const EmptyCart: FC = () => {
  const { t } = useTranslation();

  return (
    <section className={classNames(BLOCK, EMPTY_CART)}>
      <h1 className={H1}>{t(I18nKey.YourCartIsEmpty)}</h1>
      <div className={EMPTY_CART_IMG_WRAP}>
        <img src={imgSrc} alt="" className={classNames(MEDIA_CONTAIN, EMPTY_CART_IMG)} />
      </div>
      <p className={H3}>{t(I18nKey.looksLikeEmptyCart)}</p>
      <Button el="link" theme="primary" view="primary" to={getFullPath(VIEW_CATALOG)} rel="path">
        {t(I18nKey.ContinueShopping)}
      </Button>
    </section>
  );
};

export default memo(EmptyCart);
