import { FC, useCallback, useState } from 'react';
import classNames from 'classnames';
import Button from '../../shared/Button/Button';
import ValidationField from '../../shared/ValidationField/ValidationField';
import Input from '../../shared/Input/input';
import { CountryCode, TBaseAddress, TIntrinsicForm } from '../../../types/types';
import PasswordField from '../../shared/PasswordField/PasswordField';
import { getFormikErrorMsg } from '../../../utils/getFormikErrorMsg';
import { useFormik } from 'formik';
import { useAppDispatch } from '../../../hooks/store-hooks';
import {
  mutex,
  tokenLoadingEnded,
  tokenLoadingStarted,
  userTokenLoaded,
} from '../../../store/authSlice';
import { authService } from '../../../services/authService';
import Select from '../../shared/Select/Select';
import { getFullPath } from '../../../utils/getFullPath';
import { Link } from 'react-router';
import { VIEW_LOGIN } from '../../../routes';
import { useSignUpMutation } from '../../../store/storeApi';
import { getLocale } from '../../../utils/getLocale';
import { getMsgFromAxiosError } from '../../../utils/getMsgFromAxiosError';
import { delay } from '../../../utils/delay';
import { FaCheckCircle } from 'react-icons/fa';
import Checkbox from '../../shared/Checkbox/Checkbox';
import Fieldset from '../../shared/Fieldset/Fieldset';
import { nanoid } from '@reduxjs/toolkit';
import { SELECT_OPTIONS } from './selectOptions';
import { validationSchema } from './validationSchema';

import './FormRegistration.scss';

type TFormRegistrationProps = TIntrinsicForm;

export const FORM_REGISTRATION = 'form-registration';
export const FORM_REGISTRATION_LABEL = `${FORM_REGISTRATION}__label`;
export const FORM_REGISTRATION_BTN = `${FORM_REGISTRATION}__btn`;
export const FORM_REGISTRATION_ERROR_MESSAGE = `${FORM_REGISTRATION}__error-message`;
export const FORM_REGISTRATION_QUESTION = `${FORM_REGISTRATION}__question`;
export const FORM_REGISTRATION_LINK = `${FORM_REGISTRATION}__link`;
export const FORM_REGISTRATION_MESSAGE_COMPLETED = `${FORM_REGISTRATION}__message-completed`;
export const FORM_REGISTRATION_iCON_COMPLETED = `${FORM_REGISTRATION}__icon-completed`;
export const FORM_REGISTRATION_CHECKBOX_FIELD = `${FORM_REGISTRATION}__checkbox-field`;
export const FORM_REGISTRATION_CHECKBOX_LABEL = `${FORM_REGISTRATION}__checkbox-label`;
export const LOGIN_LINK_TEXT = `Already have an account? `;

const FormRegistration: FC<TFormRegistrationProps> = (props) => {
  const { className, ...restProps } = props;
  const classes = classNames(FORM_REGISTRATION, className);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [register] = useSignUpMutation({
    fixedCacheKey: 'register-customer',
  });

  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      streetName: '',
      city: '',
      postalCode: '',
      isShippingAddress: false,
      isBillingAddress: false,
      country: SELECT_OPTIONS[0].value,
    },
    validationSchema,
    onSubmit: async (values) => {
      const {
        email,
        password,
        firstName,
        lastName,
        dateOfBirth,
        streetName,
        city,
        postalCode,
        isShippingAddress,
        isBillingAddress,
        country,
      } = values;
      setIsSubmitting(true);
      setRegistrationError('');

      const addresses: TBaseAddress[] = [
        {
          key: nanoid(),
          country: country as CountryCode,
          firstName,
          lastName,
          streetName,
          city,
          postalCode,
        },
      ];
      const data = {
        firstName,
        lastName,
        email,
        password,
        dateOfBirth,
        addresses,
        locale: getLocale(country as CountryCode),
        defaultShippingAddress: isShippingAddress ? 0 : undefined,
        defaultBillingAddress: isBillingAddress ? 0 : undefined,
      };

      const response = await register(data);

      if (response.error) {
        setRegistrationError((response.error as { data: string }).data);
      } else {
        setIsRegistered(true);

        if (mutex.isLocked()) {
          await mutex.waitForUnlock();
        }

        const release = await mutex.acquire();

        await delay(500);

        try {
          dispatch(tokenLoadingStarted());
          const tokenData = await authService.getUserTokenData({ email, password });
          dispatch(
            userTokenLoaded({
              userToken: tokenData.access_token,
              userRefreshToken: tokenData.refresh_token,
            })
          );
        } catch (e) {
          setRegistrationError(getMsgFromAxiosError(e));
          dispatch(tokenLoadingEnded());
        }

        release();
      }

      setIsSubmitting(false);
    },
  });

  const handleInputFocus = useCallback(() => {
    setRegistrationError('');
  }, []);

  const emailError = getFormikErrorMsg(formik, 'email');
  const passwordError = getFormikErrorMsg(formik, 'password');
  const firstNameError = getFormikErrorMsg(formik, 'firstName');
  const lastNameError = getFormikErrorMsg(formik, 'lastName');
  const dateOfBirthError = getFormikErrorMsg(formik, 'dateOfBirth');
  const streetNameError = getFormikErrorMsg(formik, 'streetName');
  const cityError = getFormikErrorMsg(formik, 'city');
  const postalCodeError = getFormikErrorMsg(formik, 'postalCode');
  const countryError = getFormikErrorMsg(formik, 'country');

  return (
    <form className={classes} {...restProps} onSubmit={formik.handleSubmit}>
      {isRegistered ? (
        <p className={FORM_REGISTRATION_MESSAGE_COMPLETED}>
          <span className={FORM_REGISTRATION_iCON_COMPLETED}>
            <FaCheckCircle />
          </span>
          Registration has been completed!
        </p>
      ) : (
        <>
          {' '}
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
              onFocus={handleInputFocus}
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
                onFocus: handleInputFocus,
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
              onFocus={handleInputFocus}
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
              onFocus={handleInputFocus}
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
              onFocus={handleInputFocus}
              type="date"
              invalid={!!dateOfBirthError}
            />
          </ValidationField>
          <Fieldset title="Address">
            <label className={FORM_REGISTRATION_LABEL} htmlFor="streetName">
              Street
            </label>

            <ValidationField errorMsg={streetNameError}>
              <Input
                theme="primary"
                view="primary"
                name="streetName"
                id="streetName"
                value={formik.values.streetName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                onFocus={handleInputFocus}
                invalid={!!streetNameError}
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
                onFocus={handleInputFocus}
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
                onFocus={handleInputFocus}
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
                onFocus={handleInputFocus}
                options={SELECT_OPTIONS}
                invalid={!!countryError}
              />
            </ValidationField>

            <div className={FORM_REGISTRATION_CHECKBOX_FIELD}>
              <Checkbox
                theme="primary"
                view="primary"
                controlProps={{
                  name: 'isShippingAddress',
                  id: 'isShippingAddress',
                  checked: formik.values.isShippingAddress,
                  onChange: formik.handleChange,
                  onBlur: formik.handleBlur,
                  onFocus: handleInputFocus,
                }}
              />
              <label className={FORM_REGISTRATION_CHECKBOX_LABEL} htmlFor="isShippingAddress">
                Set as default shipping address
              </label>
            </div>
            <div className={FORM_REGISTRATION_CHECKBOX_FIELD}>
              <Checkbox
                theme="primary"
                view="primary"
                controlProps={{
                  name: 'isBillingAddress',
                  id: 'isBillingAddress',
                  checked: formik.values.isBillingAddress,
                  onChange: formik.handleChange,
                  onBlur: formik.handleBlur,
                  onFocus: handleInputFocus,
                }}
              />
              <label className={FORM_REGISTRATION_CHECKBOX_LABEL} htmlFor="isBillingAddress">
                Set as default billing address
              </label>
            </div>
          </Fieldset>
          <p className={FORM_REGISTRATION_ERROR_MESSAGE}> {registrationError}</p>
          <Button
            className={FORM_REGISTRATION_BTN}
            theme="primary"
            view="primary"
            el="button"
            type="submit"
            disabled={isSubmitting}>
            Register
          </Button>
          <p className={FORM_REGISTRATION_QUESTION}>
            {LOGIN_LINK_TEXT}
            <Link relative="path" className={FORM_REGISTRATION_LINK} to={getFullPath(VIEW_LOGIN)}>
              Log in
            </Link>
          </p>
        </>
      )}
    </form>
  );
};

export default FormRegistration;
