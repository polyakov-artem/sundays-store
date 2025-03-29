import { FC } from 'react';
import classNames from 'classnames';
import Button from '../../shared/Button/Button';
import ValidationField from '../../shared/ValidationField/ValidationField';
import Input from '../../shared/Input/input';
import { TIntrinsicForm } from '../../../types/types';
import PasswordField from '../../shared/PasswordField/PasswordField';
import * as Yup from 'yup';
import { getFormikErrorMsg } from '../../../utils/getFormikErrorMsg';
import { inputErrors, regexps } from '../../../constants/constants';
import { useFormik } from 'formik';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_SPECIAL_CHARS,
} from '../FormLogin/FormLogin';
import Select, { TSelectOptions } from '../../shared/Select/Select';
import './FormRegistration.scss';

type TFormRegistrationProps = TIntrinsicForm;

export const FORM_REGISTRATION = 'form-login';
export const FORM_REGISTRATION_LABEL = `${FORM_REGISTRATION}__label`;
export const FORM_REGISTRATION_BTN = `${FORM_REGISTRATION}__btn`;
export const FORM_REGISTRATION_ERROR_MESSAGE = `${FORM_REGISTRATION}__error-message`;

export const MIN_AGE = 13;

export const emailValidator = Yup.string()
  .matches(regexps.onlyNonWhitespaces, inputErrors.whitespaces)
  .matches(regexps.containsEmailSeparator, inputErrors.emailSeparator)
  .matches(regexps.containsDomainName, inputErrors.domainName)
  .email(inputErrors.email)
  .required(inputErrors.required);

export const passwordValidator = Yup.string()
  .min(PASSWORD_MIN_LENGTH, inputErrors.length(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH))
  .max(PASSWORD_MAX_LENGTH, inputErrors.length(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH))
  .matches(regexps.onlyNonWhitespaces, inputErrors.whitespaces)
  .matches(regexps.containsUppercaseLetter, inputErrors.uppercaseLetter)
  .matches(regexps.containsLowercaseLetter, inputErrors.lowercaseLetter)
  .matches(regexps.containsDigit, inputErrors.digit)
  .matches(new RegExp(`[${PASSWORD_SPECIAL_CHARS}]`), inputErrors.oneOf(PASSWORD_SPECIAL_CHARS))
  .required(inputErrors.required);

const validationSchema = Yup.object().shape({
  email: emailValidator,
  password: passwordValidator,
  firstName: Yup.string()
    .matches(regexps.charsWithoutNumbersAndSpecials, inputErrors.charsWithoutNumbersAndSpecials)
    .required(inputErrors.required),
  lastName: Yup.string()
    .matches(regexps.charsWithoutNumbersAndSpecials, inputErrors.charsWithoutNumbersAndSpecials)
    .required(inputErrors.required),
  dateOfBirth: Yup.string()
    .matches(regexps.dateYYYYMMDDFormat, inputErrors.date)
    .test('dates-test', inputErrors.age(MIN_AGE), (value: string | undefined) => {
      if (!value) return false;
      const dates = value.split('-');

      if (dates.length !== 3) return false;
      let dateOfBirth: Date;

      try {
        dateOfBirth = new Date(parseInt(dates[0]), parseInt(dates[1]) - 1, parseInt(dates[2]));
      } catch {
        return false;
      }

      if (Date.now() - dateOfBirth.getTime() < new Date(1970 + MIN_AGE, 0).getTime()) {
        return false;
      }

      return true;
    })

    .required(inputErrors.required),
  street: Yup.string()
    .matches(regexps.containsChar, inputErrors.chars)
    .required(inputErrors.required),
  city: Yup.string()
    .matches(regexps.charsWithoutNumbersAndSpecials, inputErrors.charsWithoutNumbersAndSpecials)
    .required(inputErrors.required),
  postalCode: Yup.string()
    .matches(regexps.postalCode, inputErrors.postalCode)
    .required(inputErrors.required),
  country: Yup.string()
    .test('country-test', inputErrors.country, (currentValue: string | undefined) => {
      return SELECT_OPTIONS.some(({ value }) => value === currentValue);
    })
    .required(inputErrors.required),
});

export const SELECT_OPTIONS: TSelectOptions = [
  {
    label: 'United Kingdom',
    value: 'GB',
  },
  {
    label: 'Germany',
    value: 'DE',
  },
  {
    label: 'United States',
    value: 'US',
  },
];

const FormRegistration: FC<TFormRegistrationProps> = (props) => {
  const { className, ...restProps } = props;
  const classes = classNames(FORM_REGISTRATION, className);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      street: '',
      city: '',
      postalCode: '',
      country: SELECT_OPTIONS[0].value,
    },
    validationSchema,
    onSubmit: async () => {},
  });

  const emailError = getFormikErrorMsg(formik, 'email');
  const passwordError = getFormikErrorMsg(formik, 'password');
  const firstNameError = getFormikErrorMsg(formik, 'firstName');
  const lastNameError = getFormikErrorMsg(formik, 'lastName');
  const dateOfBirthError = getFormikErrorMsg(formik, 'dateOfBirth');
  const streetError = getFormikErrorMsg(formik, 'street');
  const cityError = getFormikErrorMsg(formik, 'city');
  const postalCodeError = getFormikErrorMsg(formik, 'postalCode');
  const countryError = getFormikErrorMsg(formik, 'country');

  return (
    <form className={classes} {...restProps} onSubmit={formik.handleSubmit}>
      <label className={FORM_REGISTRATION_LABEL} htmlFor="email">
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
          invalid={!!emailError}
        />
      </ValidationField>
      <label className={FORM_REGISTRATION_LABEL} htmlFor="password">
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
            invalid: !!passwordError,
          }}
        />
      </ValidationField>

      <label className={FORM_REGISTRATION_LABEL} htmlFor="firstName">
        First name
      </label>
      <ValidationField errorMsg={firstNameError}>
        <Input
          theme="primary"
          view="primary"
          name="firstName"
          id="firstName"
          value={formik.values.firstName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={!!firstNameError}
        />
      </ValidationField>

      <label className={FORM_REGISTRATION_LABEL} htmlFor="lastName">
        Last name
      </label>
      <ValidationField errorMsg={lastNameError}>
        <Input
          theme="primary"
          view="primary"
          name="lastName"
          id="lastName"
          value={formik.values.lastName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={!!lastNameError}
        />
      </ValidationField>

      <label className={FORM_REGISTRATION_LABEL} htmlFor="dateOfBirth">
        Date of birth
      </label>
      <ValidationField errorMsg={dateOfBirthError}>
        <Input
          theme="primary"
          view="primary"
          name="dateOfBirth"
          id="dateOfBirth"
          value={formik.values.dateOfBirth}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          type="date"
          invalid={!!dateOfBirthError}
        />
      </ValidationField>

      <label className={FORM_REGISTRATION_LABEL} htmlFor="street">
        Street
      </label>
      <ValidationField errorMsg={streetError}>
        <Input
          theme="primary"
          view="primary"
          name="street"
          id="street"
          value={formik.values.street}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={!!streetError}
        />
      </ValidationField>

      <label className={FORM_REGISTRATION_LABEL} htmlFor="city">
        City
      </label>
      <ValidationField errorMsg={cityError}>
        <Input
          theme="primary"
          view="primary"
          name="city"
          id="city"
          value={formik.values.city}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={!!cityError}
        />
      </ValidationField>

      <label className={FORM_REGISTRATION_LABEL} htmlFor="postalCode">
        Postal code
      </label>
      <ValidationField errorMsg={postalCodeError}>
        <Input
          theme="primary"
          view="primary"
          name="postalCode"
          id="postalCode"
          value={formik.values.postalCode}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          invalid={!!postalCodeError}
        />
      </ValidationField>

      <label className={FORM_REGISTRATION_LABEL} htmlFor="country">
        Country
      </label>
      <ValidationField errorMsg={countryError}>
        <Select
          theme="primary"
          view="primary"
          name="country"
          id="country"
          value={formik.values.country}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          options={SELECT_OPTIONS}
          invalid={!!countryError}
        />
      </ValidationField>

      <Button
        className={FORM_REGISTRATION_BTN}
        theme="primary"
        view="primary"
        el="button"
        type="submit">
        Register
      </Button>
    </form>
  );
};

export default FormRegistration;
