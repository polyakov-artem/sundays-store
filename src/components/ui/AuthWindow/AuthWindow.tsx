import { FC } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router';
import { getFullPath } from '../../../utils/getFullPath';
import { VIEW_LOGIN, VIEW_REGISTER } from '../../../routes';
import { TAuthProps, TIntrinsicDiv } from '../../../types/types';

import './AuthWindow.scss';

export type TAuthWindow = TIntrinsicDiv & TAuthProps;

export const AUTH_WINDOW = 'auth-window';
export const AUTH_WINDOW_LINK = `${AUTH_WINDOW}__link`;
export const AUTH_WINDOW_QUESTION = `${AUTH_WINDOW}__question`;
export const REGISTER_LINK_TEXT = `Don't have an account yet? `;
export const LOGIN_LINK_TEXT = `Already have an account? `;

const AuthWindow: FC<TAuthWindow> = (props) => {
  const { className, type, ...restProps } = props;
  const classes = classNames(AUTH_WINDOW, className);

  return (
    <div className={classes} {...restProps}>
      {type === 'login' ? (
        <>
          <p className={AUTH_WINDOW_QUESTION}>
            {REGISTER_LINK_TEXT}
            <Link relative="path" className={AUTH_WINDOW_LINK} to={getFullPath(VIEW_REGISTER)}>
              Register
            </Link>
          </p>
        </>
      ) : (
        <>
          <p className={AUTH_WINDOW_QUESTION}>
            {LOGIN_LINK_TEXT}
            <Link relative="path" className={AUTH_WINDOW_LINK} to={getFullPath(VIEW_LOGIN)}>
              Log in
            </Link>
          </p>
        </>
      )}
    </div>
  );
};

export default AuthWindow;
