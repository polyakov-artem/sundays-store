import { FC, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import Button from '../../shared/Button/Button';
import ValidationField from '../../shared/ValidationField/ValidationField';
import InputField from '../../shared/InputField/InputField';
import { TIntrinsicForm } from '../../../types/types';
import * as Yup from 'yup';
import { inputErrors } from '../../../constants/constants';
import { Form, Formik } from 'formik';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectLocale } from '../../../store/settingsSlice';
import { AppStrings } from '../../../constants/appStrings';
import { localizedAppStrings } from '../../../constants/localizedAppStrings';
import { TCustomError, useSignInMutation } from '../../../store/storeApi';
import './FormLogin.scss';

export type TFormLoginProps = { onSuccess?: () => Promise<void> | void } & TIntrinsicForm;

export const FORM_LOGIN = 'form-login';
export const FORM_LOGIN_LABEL = `${FORM_LOGIN}__label`;
export const FORM_LOGIN_BTN = `${FORM_LOGIN}__btn`;
export const FORM_LOGIN_ERROR_MESSAGE = `${FORM_LOGIN}__error-message`;
export const FORM_LOGIN_QUESTION = `${FORM_LOGIN}__question`;
export const FORM_LOGIN_LINK = `${FORM_LOGIN}__link`;

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 30;
export const PASSWORD_SPECIAL_CHARS = '!@#$%^&*';

export const KEY_EMAIL = 'email';
export const KEY_PASSWORD = 'password';

const validationSchema = Yup.object().shape({
  [KEY_EMAIL]: Yup.string()
    .matches(/^\S+$/, inputErrors.whitespaces)
    .matches(/@/, inputErrors.emailSeparator)
    .matches(/@\S+\.\S+/, inputErrors.domainName)
    .email(inputErrors.email)
    .required(inputErrors.required),
  [KEY_PASSWORD]: Yup.string()
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
  const { className, onSuccess, ...restProps } = props;
  const classes = classNames(FORM_LOGIN, className);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const locale = useAppSelector(selectLocale);
  const formRef = useRef<HTMLFormElement>(null);
  const [signIn] = useSignInMutation();

  useEffect(() => {
    const form = formRef.current;
    const handleFocus = () => setLoginError('');
    form?.addEventListener('focusin', handleFocus);
    return () => form?.removeEventListener('focusin', handleFocus);
  });

  return (
    <Formik
      initialValues={{
        [KEY_EMAIL]: '',
        [KEY_PASSWORD]: '',
      }}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        setIsSubmitting(true);
        setLoginError('');

        const { error: signinError } = await signIn(values);

        if (signinError) {
          setLoginError((signinError as TCustomError).data);
          setIsSubmitting(false);
          return;
        }

        await onSuccess?.();
        setIsSubmitting(false);
      }}>
      <Form className={classes} {...restProps} ref={formRef}>
        <label className={FORM_LOGIN_LABEL} htmlFor={KEY_EMAIL}>
          {localizedAppStrings[locale][AppStrings.Email]}
        </label>
        <ValidationField
          Component={InputField}
          componentProps={{
            theme: 'primary',
            view: 'primary',
            name: KEY_EMAIL,
            id: KEY_EMAIL,
          }}
        />

        <label className={FORM_LOGIN_LABEL} htmlFor={KEY_PASSWORD}>
          {localizedAppStrings[locale][AppStrings.Password]}
        </label>
        <ValidationField
          Component={InputField}
          componentProps={{
            theme: 'primary',
            view: 'primary',
            name: KEY_PASSWORD,
            id: KEY_PASSWORD,
          }}
        />

        <p className={FORM_LOGIN_ERROR_MESSAGE}> {loginError}</p>
        <Button
          className={FORM_LOGIN_BTN}
          theme="primary"
          view="primary"
          el="button"
          type="submit"
          disabled={isSubmitting}>
          {localizedAppStrings[locale][AppStrings.LogIn]}
        </Button>
      </Form>
    </Formik>
  );
};

export default FormLogin;
