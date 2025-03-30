import { FC } from 'react';
import classNames from 'classnames';
import { TAuthProps, TIntrinsicDiv } from '../../../types/types';
import FormLogin from '../FormLogin/FormLogin';
import FormRegistration from '../FormRegistration/FormRegistration';
import './AuthWindow.scss';

export type TAuthWindow = TIntrinsicDiv & TAuthProps;

export const AUTH_WINDOW = 'auth-window';

const AuthWindow: FC<TAuthWindow> = (props) => {
  const { className, type, ...restProps } = props;
  const classes = classNames(AUTH_WINDOW, className);

  return (
    <div className={classes} {...restProps}>
      {type === 'login' ? (
        <>
          <FormLogin />
        </>
      ) : (
        <>
          <FormRegistration />
        </>
      )}
    </div>
  );
};

export default AuthWindow;
