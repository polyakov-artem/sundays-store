import { FC, memo } from 'react';
import { PUBLIC_PATH } from '../../../constants/constants';
import Button from '../../shared/Button/Button';
import imgSrc from './img/1.png';
import { useTranslation } from 'react-i18next';
import { I18nKey } from '../../../utils/i18n/i18nKey';
import { BLOCK, WRAPPER } from '../../../constants/cssHelpers';
import classNames from 'classnames';
import './ViewNotFound.scss';

export const VIEW_NOT_FOUND = 'view-not-found';
export const NOT_FOUND_WINDOW = `${VIEW_NOT_FOUND}__window`;
export const NOT_FOUND_TITLE = `${VIEW_NOT_FOUND}__title`;
export const NOT_FOUND_BTN = `${VIEW_NOT_FOUND}__btn`;
export const NOT_FOUND_IMG = `${VIEW_NOT_FOUND}__img`;

const windowClasses = classNames(WRAPPER, BLOCK, NOT_FOUND_WINDOW);

const ViewNotFound: FC = () => {
  const { t } = useTranslation();

  return (
    <main className={VIEW_NOT_FOUND}>
      <div className={windowClasses}>
        <h1 className={NOT_FOUND_TITLE}>{t(I18nKey.PageWasNotFound)}</h1>
        <img className={NOT_FOUND_IMG} src={imgSrc} alt="" />
        <Button
          className={NOT_FOUND_BTN}
          el="a"
          theme="primary"
          view="primary"
          href={`${PUBLIC_PATH}`}>
          {t(I18nKey.GoToHomePage)}
        </Button>
      </div>
    </main>
  );
};

export default memo(ViewNotFound);
