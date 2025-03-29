import { FC, useCallback, useState } from 'react';
import classNames from 'classnames';
import Button from '../../shared/Button/Button';
import ValidationField from '../../shared/ValidationField/ValidationField';
import Input from '../../shared/Input/input';
import { TIntrinsicForm } from '../../../types/types';
import PasswordField from '../../shared/PasswordField/PasswordField';
import * as Yup from 'yup';
import { getFormikErrorMsg } from '../../../utils/getFormikErrorMsg';
import { inputErrors } from '../../../constants/constants';
import { useFormik } from 'formik';
import './FormLogin.scss';
import { useAppDispatch } from '../../../hooks/store-hooks';
import {
  mutex,
  tokenLoadingEnded,
  tokenLoadingStarted,
  userTokenLoaded,
} from '../../../store/authSlice';
import { authService } from '../../../services/authService';
import { getMsgFromAxiosError } from '../../../utils/getMsgFromAxiosError';
import { Link } from 'react-router';
import { getFullPath } from '../../../utils/getFullPath';
import { VIEW_REGISTER } from '../../../routes';

type TFormLoginProps = TIntrinsicForm;

export const FORM_LOGIN = 'form-login';
export const FORM_LOGIN_LABEL = `${FORM_LOGIN}__label`;
export const FORM_LOGIN_BTN = `${FORM_LOGIN}__btn`;
export const FORM_LOGIN_ERROR_MESSAGE = `${FORM_LOGIN}__error-message`;
export const FORM_LOGIN_QUESTION = `${FORM_LOGIN}__question`;
export const FORM_LOGIN_LINK = `${FORM_LOGIN}__link`;
export const REGISTER_LINK_TEXT = `Don't have an account yet? `;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 30;
export const PASSWORD_SPECIAL_CHARS = '!@#$%^&*';

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .matches(/^\S+$/, inputErrors.whitespaces)
    .matches(/@/, inputErrors.emailSeparator)
    .matches(/@\S+\.\S+/, inputErrors.domainName)
    .email(inputErrors.email)
    .required(inputErrors.required),
  password: Yup.string()
    .min(PASSWORD_MIN_LENGTH, inputErrors.length(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH))
    .max(PASSWORD_MAX_LENGTH, inputErrors.length(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH))
    .matches(/^\S+$/, inputErrors.whitespaces)
    .matches(/[A-Z]/, inputErrors.uppercaseLetter)
    .matches(/[a-z]/, inputErrors.lowercaseLetter)
    .matches(/[0-9]/, inputErrors.digit)
    .matches(new RegExp(`[${PASSWORD_SPECIAL_CHARS}]`), inputErrors.oneOf(PASSWORD_SPECIAL_CHARS))
    .required(inputErrors.required),
});

const FormLogin: FC<TFormLoginProps> = (props) => {
  const { className, ...restProps } = props;
  const classes = classNames(FORM_LOGIN, className);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');

  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      setLoginError('');
      if (mutex.isLocked()) {
        await mutex.waitForUnlock();
      }

      const release = await mutex.acquire();

      try {
        const tokenData = await authService.getUserTokenData(values);
        dispatch(tokenLoadingStarted());
        dispatch(
          userTokenLoaded({
            userToken: tokenData.access_token,
            userRefreshToken: tokenData.refresh_token,
          })
        );
      } catch (e) {
        setLoginError(getMsgFromAxiosError(e));
        dispatch(tokenLoadingEnded());
      }

      release();
      setIsSubmitting(false);
    },
  });

  const handleInputFocus = useCallback(() => {
    setLoginError('');
  }, []);

  const emailError = getFormikErrorMsg(formik, 'email');
  const passwordError = getFormikErrorMsg(formik, 'password');

  return (
    <form className={classes} {...restProps} onSubmit={formik.handleSubmit}>
      <label className={FORM_LOGIN_LABEL} htmlFor="email">
        Email
      </label>
      <ValidationField errorMsg={emailError}>
        <Input
          theme="primary"
          view="primary"
          name="email"
          id="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          onFocus={handleInputFocus}
        />
      </ValidationField>
      <label className={FORM_LOGIN_LABEL} htmlFor="password">
        Password
      </label>
      <ValidationField errorMsg={passwordError}>
        <PasswordField
          inputProps={{
            view: 'primary',
            theme: 'primary',
            name: 'password',
            id: 'password',
            value: formik.values.password,
            onChange: formik.handleChange,
            onBlur: formik.handleBlur,
            onFocus: handleInputFocus,
          }}
        />
      </ValidationField>
      <p className={FORM_LOGIN_ERROR_MESSAGE}> {loginError}</p>
      <Button
        className={FORM_LOGIN_BTN}
        theme="primary"
        view="primary"
        el="button"
        type="submit"
        disabled={isSubmitting}>
        Login
      </Button>
      <p className={FORM_LOGIN_QUESTION}>
        {REGISTER_LINK_TEXT}
        <Link relative="path" className={FORM_LOGIN_LINK} to={getFullPath(VIEW_REGISTER)}>
          Register
        </Link>
      </p>
    </form>
  );
};

export default FormLogin;
