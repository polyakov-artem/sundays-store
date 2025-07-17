import { FC, useCallback, useState } from 'react';
import classNames from 'classnames';
import { TAuthProps, TIntrinsicDiv } from '../../../types/types';
import FormLogin from '../FormLogin/FormLogin';
import FormRegistration from '../FormRegistration/FormRegistration';
import { FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router';
import { getFullPath } from '../../../utils/getFullPath';
import { VIEW_LOGIN, VIEW_REGISTER } from '../../../constants/constants';
import { useTranslation } from 'react-i18next';
import { I18nKey } from '../../../utils/i18n/i18nKey';
import './AuthWindow.scss';

export type TAuthWindow = TIntrinsicDiv & TAuthProps;

export const AUTH_WINDOW = 'auth-window';
export const AUTH_WINDOW_iCON = `${AUTH_WINDOW}__icon`;
export const AUTH_WINDOW_MESSAGE = `${AUTH_WINDOW}__message`;
export const AUTH_WINDOW_QUESTION = `${AUTH_WINDOW}__question`;
export const AUTH_WINDOW_LINK = `${AUTH_WINDOW}__link`;

const AuthWindow: FC<TAuthWindow> = (props) => {
  const { className, type, ...restProps } = props;
  const classes = classNames(AUTH_WINDOW, className);
  const [isSent, setIsSent] = useState(false);
  const { t } = useTranslation();

  const handleSubmit = useCallback(() => setIsSent(true), []);

  let content;

  if (isSent === true) {
    content = (
      <p className={AUTH_WINDOW_MESSAGE}>
        <span className={AUTH_WINDOW_iCON}>
          <FaCheckCircle />
        </span>
        {`${t(I18nKey.CompletedSuccessfully)}!`}
      </p>
    );
  } else if (type === 'login') {
    content = (
      <>
        <FormLogin onSuccess={handleSubmit} />
        <p className={AUTH_WINDOW_QUESTION}>
          {t(I18nKey.QDontHaveAnAccountYet)}{' '}
          <Link relative="path" className={AUTH_WINDOW_LINK} to={getFullPath(VIEW_REGISTER)}>
            {t(I18nKey.Register)}
          </Link>
        </p>
      </>
    );
  } else {
    content = (
      <>
        <FormRegistration onSuccess={handleSubmit} />
        <p className={AUTH_WINDOW_QUESTION}>
          {t(I18nKey.QAlreadyHaveAnAccount)}{' '}
          <Link relative="path" className={AUTH_WINDOW_LINK} to={getFullPath(VIEW_LOGIN)}>
            {t(I18nKey.LogIn)}
          </Link>
        </p>
      </>
    );
  }

  return (
    <div className={classes} {...restProps}>
      {content}
    </div>
  );
};

export default AuthWindow;
