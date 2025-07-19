import { FC, memo } from 'react';
import { PUBLIC_PATH } from '../../../constants/constants';
import Button from '../../shared/Button/Button';
import imgSrc from './img/1.png';
import { useTranslation } from 'react-i18next';
import { I18nKey } from '../../../utils/i18n/i18nKey';
import { BLOCK, WRAPPER } from '../../../constants/cssHelpers';
import classNames from 'classnames';
import { getClasses } from '../../../utils/getClasses';
import { TIntrinsicMain } from '../../../types/types';
import './ViewError.scss';

export type TViewErrorProps = {
  isRoot?: boolean;
} & TIntrinsicMain;

export const VIEW_ERROR = 'view-error';
export const VIEW_ERROR_WINDOW = `${VIEW_ERROR}__window`;
export const VIEW_ERROR_TITLE = `${VIEW_ERROR}__title`;
export const VIEW_ERROR_BTN = `${VIEW_ERROR}__btn`;
export const VIEW_ERROR_IMG = `${VIEW_ERROR}__img`;
export const VIEW_ERROR_BUTTONS = `${VIEW_ERROR}__buttons`;

const windowClasses = classNames(WRAPPER, BLOCK, VIEW_ERROR_WINDOW);

const ViewError: FC<TViewErrorProps> = (props) => {
  const { isRoot } = props;
  const classes = getClasses(VIEW_ERROR, null, { isRoot });

  const { t } = useTranslation();

  return (
    <main className={classes}>
      <div className={windowClasses}>
        <h1 className={VIEW_ERROR_TITLE}>{t(I18nKey.SomethingWentWrong)}...</h1>
        <img className={VIEW_ERROR_IMG} src={imgSrc} alt="" />
        <div className={VIEW_ERROR_BUTTONS}>
          <Button
            className={VIEW_ERROR_BTN}
            el="a"
            theme="primary"
            view="primary"
            href={`${PUBLIC_PATH}`}>
            {t(I18nKey.GoToHomePage)}
          </Button>
          <Button
            className={VIEW_ERROR_BTN}
            el="button"
            theme="primary"
            view="primary"
            onClick={() => location.reload()}>
            {t(I18nKey.ReloadPage)}
          </Button>
        </div>
      </div>
    </main>
  );
};

export default memo(ViewError);
