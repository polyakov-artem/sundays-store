import { FC } from 'react';
import classNames from 'classnames';
import Button from '../../shared/Button/Button';
import ValidationField from '../../shared/ValidationField/ValidationField';
import Input from '../../shared/Input/input';
import { TIntrinsicForm } from '../../../types/types';
import PasswordField from '../../shared/PasswordField/PasswordField';
import './FormLogin.scss';

type TFormLoginProps = TIntrinsicForm;

const FORM_LOGIN = 'form-login';
const FORM_LOGIN_LABEL = `${FORM_LOGIN}__label`;
const FORM_LOGIN_BTN = `${FORM_LOGIN}__btn`;

const FormLogin: FC<TFormLoginProps> = (props) => {
  const { className, ...restProps } = props;
  const classes = classNames(FORM_LOGIN, className);

  return (
    <form className={classes} {...restProps} onSubmit={(e) => e.preventDefault()}>
      <label className={FORM_LOGIN_LABEL} htmlFor="email">
        Email
      </label>
      <ValidationField>
        <Input theme="primary" view="primary" name="email" id="email" />
      </ValidationField>
      <div className="">
        <label className={FORM_LOGIN_LABEL} htmlFor="password">
          Password
        </label>
      </div>
      <ValidationField>
        <PasswordField
          inputProps={{ view: 'primary', theme: 'primary', name: 'password', id: 'password' }}
        />
      </ValidationField>
      <Button className={FORM_LOGIN_BTN} theme="primary" view="primary" el="button">
        Login
      </Button>
    </form>
  );
};

export default FormLogin;
