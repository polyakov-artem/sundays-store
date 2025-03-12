import { FC } from 'react';
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

type TFormLoginProps = TIntrinsicForm;

export const FORM_LOGIN = 'form-login';
export const FORM_LOGIN_LABEL = `${FORM_LOGIN}__label`;
export const FORM_LOGIN_BTN = `${FORM_LOGIN}__btn`;

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

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: (values) => {
      console.log(JSON.stringify(values, null, 2));
    },
  });

  const emailError = getFormikErrorMsg(formik, 'email');
  const passwordError = getFormikErrorMsg(formik, 'password');

  return (
    <form className={classes} {...restProps} onSubmit={(e) => e.preventDefault()}>
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
          }}
        />
      </ValidationField>
      <Button className={FORM_LOGIN_BTN} theme="primary" view="primary" el="button">
        Login
      </Button>
    </form>
  );
};

export default FormLogin;
