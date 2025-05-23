import { ChangeEvent, FC, useCallback, useState } from 'react';
import classNames from 'classnames';
import Button from '../../shared/Button/Button';
import ValidationField from '../../shared/ValidationField/ValidationField';
import InputField from '../../shared/InputField/InputField';
import { CountryCode, CountryLocale, TBaseAddress, TIntrinsicForm } from '../../../types/types';
import PasswordField from '../../shared/PasswordField/PasswordField';
import { getFormikErrorMsg } from '../../../utils/getFormikErrorMsg';
import { useFormik } from 'formik';
import { useAppDispatch, useAppSelector } from '../../../hooks/store-hooks';
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
import { VIEW_LOGIN } from '../../../constants/constants';
import { useSignUpMutation } from '../../../store/storeApi';
import { getMsgFromAxiosError } from '../../../utils/getMsgFromAxiosError';
import { delay } from '../../../utils/delay';
import { FaCheckCircle } from 'react-icons/fa';
import Checkbox from '../../shared/Checkbox/Checkbox';
import Fieldset from '../../shared/Fieldset/Fieldset';
import { nanoid } from '@reduxjs/toolkit';
import { SELECT_OPTIONS } from './selectOptions';
import { validationSchema } from './validationSchema';
import { selectLocale } from '../../../store/settingsSlice';
import { localizedAppStrings } from '../../../constants/localizedAppStrings';
import { AppStrings } from '../../../constants/appStrings';
import './FormRegistration.scss';

export type TFormRegistrationProps = TIntrinsicForm;

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
export const FORM_REGISTRATION_SHIPPING_ADDRESS = `${FORM_REGISTRATION}__shipping-address`;

const FormRegistration: FC<TFormRegistrationProps> = (props) => {
  const { className, ...restProps } = props;
  const classes = classNames(FORM_REGISTRATION, className);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [isRegistered, setIsRegistered] = useState(false);
  const [register] = useSignUpMutation({
    fixedCacheKey: 'register-customer',
  });

  const locale = useAppSelector(selectLocale);
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      shippingStreetName: '',
      shippingCity: '',
      shippingPostalCode: '',
      shippingCountry: SELECT_OPTIONS[0].value,
      billingStreetName: '',
      billingCity: '',
      billingPostalCode: '',
      billingCountry: SELECT_OPTIONS[0].value,
      isDefaultShippingAddress: false,
      isDefaultBillingAddress: false,
      isTheSameAddressAsShipping: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      const {
        email,
        password,
        firstName,
        lastName,
        dateOfBirth,
        shippingStreetName,
        shippingCity,
        shippingPostalCode,
        shippingCountry,
        billingStreetName,
        billingCity,
        billingPostalCode,
        billingCountry,
        isDefaultShippingAddress,
        isDefaultBillingAddress,
        isTheSameAddressAsShipping,
      } = values;
      setIsSubmitting(true);
      setRegistrationError('');

      const locale = CountryLocale[billingCountry as CountryCode];

      const shippingAddress: TBaseAddress = {
        key: nanoid(),
        firstName,
        lastName,
        country: shippingCountry as CountryCode,
        streetName: shippingStreetName,
        city: shippingCity,
        postalCode: shippingPostalCode,
      };

      const billingAddress: TBaseAddress = {
        key: nanoid(),
        firstName,
        lastName,
        country: billingCountry as CountryCode,
        streetName: billingStreetName,
        city: billingCity,
        postalCode: billingPostalCode,
      };

      const addresses: TBaseAddress[] = isTheSameAddressAsShipping
        ? [shippingAddress]
        : [shippingAddress, billingAddress];

      const data = {
        firstName,
        lastName,
        email,
        password,
        dateOfBirth,
        addresses,
        locale,
        defaultShippingAddress: isDefaultShippingAddress ? 0 : undefined,
        defaultBillingAddress: !isDefaultBillingAddress
          ? undefined
          : isTheSameAddressAsShipping
            ? 0
            : 1,
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
  const shippingStreetNameError = getFormikErrorMsg(formik, 'shippingStreetName');
  const shippingCityError = getFormikErrorMsg(formik, 'shippingCity');
  const shippingPostalCodeError = getFormikErrorMsg(formik, 'shippingPostalCode');
  const shippingCountryError = getFormikErrorMsg(formik, 'shippingCountry');
  const billingStreetNameError = getFormikErrorMsg(formik, 'billingStreetName');
  const billingCityError = getFormikErrorMsg(formik, 'billingCity');
  const billingPostalCodeError = getFormikErrorMsg(formik, 'billingPostalCode');
  const billingCountryError = getFormikErrorMsg(formik, 'billingCountry');

  const handleTheSameAddressClick = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        const { shippingStreetName, shippingCity, shippingPostalCode, shippingCountry } =
          formik.values;
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        formik.setValues(
          (prevState) => ({
            ...prevState,
            billingStreetName: shippingStreetName,
            billingCity: shippingCity,
            billingPostalCode: shippingPostalCode,
            billingCountry: shippingCountry,
          }),
          true
        );
      }

      formik.handleChange(e);
    },
    [formik]
  );

  const handleShippingStreetNameChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      if (formik.values.isTheSameAddressAsShipping) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        formik.setFieldValue('billingStreetName', value, true);
      }

      formik.handleChange(e);
    },
    [formik]
  );

  const handleShippingCityChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      if (formik.values.isTheSameAddressAsShipping) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        formik.setFieldValue('billingCity', value, true);
      }

      formik.handleChange(e);
    },
    [formik]
  );

  const handleShippingPostalCodeChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      if (formik.values.isTheSameAddressAsShipping) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        formik.setFieldValue('billingPostalCode', value, true);
      }

      formik.handleChange(e);
    },
    [formik]
  );

  const handleShippingCountryChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      const { value } = e.target;
      if (formik.values.isTheSameAddressAsShipping) {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        formik.setFieldValue('billingCountry', value, true);
      }

      formik.handleChange(e);
    },
    [formik]
  );

  return (
    <form className={classes} {...restProps} onSubmit={formik.handleSubmit}>
      {isRegistered ? (
        <p className={FORM_REGISTRATION_MESSAGE_COMPLETED}>
          <span className={FORM_REGISTRATION_iCON_COMPLETED}>
            <FaCheckCircle />
          </span>
          {`${localizedAppStrings[locale][AppStrings.RegistrationHasBeenCompleted]}!`}
        </p>
      ) : (
        <>
          <label className={FORM_REGISTRATION_LABEL} htmlFor="email">
            {localizedAppStrings[locale][AppStrings.Email]}
          </label>
          <ValidationField errorMsg={emailError}>
            <InputField
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
            {localizedAppStrings[locale][AppStrings.Password]}
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
            {localizedAppStrings[locale][AppStrings.FirstName]}
          </label>
          <ValidationField errorMsg={firstNameError}>
            <InputField
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
            {localizedAppStrings[locale][AppStrings.LastName]}
          </label>
          <ValidationField errorMsg={lastNameError}>
            <InputField
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
            {localizedAppStrings[locale][AppStrings.DateOfBirth]}
          </label>
          <ValidationField errorMsg={dateOfBirthError}>
            <InputField
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
          <Fieldset
            className={FORM_REGISTRATION_SHIPPING_ADDRESS}
            title={localizedAppStrings[locale][AppStrings.ShippingAddress]}>
            <div className={FORM_REGISTRATION_CHECKBOX_FIELD}>
              <Checkbox
                theme="primary"
                view="primary"
                controlProps={{
                  name: 'isDefaultShippingAddress',
                  id: 'isDefaultShippingAddress',
                  checked: formik.values.isDefaultShippingAddress,
                  onChange: formik.handleChange,
                  onBlur: formik.handleBlur,
                  onFocus: handleInputFocus,
                }}
              />
              <label
                className={FORM_REGISTRATION_CHECKBOX_LABEL}
                htmlFor="isDefaultShippingAddress">
                {localizedAppStrings[locale][AppStrings.SetAsDefaultShippingAddress]}
              </label>
            </div>
            <label className={FORM_REGISTRATION_LABEL} htmlFor="shippingStreetName">
              {localizedAppStrings[locale][AppStrings.Street]}
            </label>

            <ValidationField errorMsg={shippingStreetNameError}>
              <InputField
                theme="primary"
                view="primary"
                name="shippingStreetName"
                id="shippingStreetName"
                value={formik.values.shippingStreetName}
                onChange={handleShippingStreetNameChange}
                onBlur={formik.handleBlur}
                onFocus={handleInputFocus}
                invalid={!!shippingStreetNameError}
              />
            </ValidationField>
            <label className={FORM_REGISTRATION_LABEL} htmlFor="shippingCity">
              {localizedAppStrings[locale][AppStrings.City]}
            </label>
            <ValidationField errorMsg={shippingCityError}>
              <InputField
                theme="primary"
                view="primary"
                name="shippingCity"
                id="shippingCity"
                value={formik.values.shippingCity}
                onChange={handleShippingCityChange}
                onBlur={formik.handleBlur}
                onFocus={handleInputFocus}
                invalid={!!shippingCityError}
              />
            </ValidationField>
            <label className={FORM_REGISTRATION_LABEL} htmlFor="shippingPostalCode">
              {localizedAppStrings[locale][AppStrings.PostalCode]}
            </label>
            <ValidationField errorMsg={shippingPostalCodeError}>
              <InputField
                theme="primary"
                view="primary"
                name="shippingPostalCode"
                id="shippingPostalCode"
                value={formik.values.shippingPostalCode}
                onChange={handleShippingPostalCodeChange}
                onBlur={formik.handleBlur}
                onFocus={handleInputFocus}
                invalid={!!shippingPostalCodeError}
              />
            </ValidationField>
            <label className={FORM_REGISTRATION_LABEL} htmlFor="shippingCountry">
              {localizedAppStrings[locale][AppStrings.Country]}
            </label>
            <ValidationField errorMsg={shippingCountryError}>
              <Select
                theme="primary"
                view="primary"
                name="shippingCountry"
                id="shippingCountry"
                value={formik.values.shippingCountry}
                onChange={handleShippingCountryChange}
                onBlur={formik.handleBlur}
                onFocus={handleInputFocus}
                options={SELECT_OPTIONS}
                invalid={!!shippingCountryError}
              />
            </ValidationField>
          </Fieldset>
          <Fieldset title={localizedAppStrings[locale][AppStrings.BillingAddress]}>
            <div className={FORM_REGISTRATION_CHECKBOX_FIELD}>
              <Checkbox
                theme="primary"
                view="primary"
                controlProps={{
                  name: 'isTheSameAddressAsShipping',
                  id: 'isTheSameAddressAsShipping',
                  checked: formik.values.isTheSameAddressAsShipping,
                  onChange: handleTheSameAddressClick,
                  onBlur: formik.handleBlur,
                  onFocus: handleInputFocus,
                }}
              />
              <label
                className={FORM_REGISTRATION_CHECKBOX_LABEL}
                htmlFor="isTheSameAddressAsShipping">
                {localizedAppStrings[locale][AppStrings.TheSameAsShippingAddress]}
              </label>
            </div>

            <div className={FORM_REGISTRATION_CHECKBOX_FIELD}>
              <Checkbox
                theme="primary"
                view="primary"
                controlProps={{
                  name: 'isDefaultBillingAddress',
                  id: 'isDefaultBillingAddress',
                  checked: formik.values.isDefaultBillingAddress,
                  onChange: formik.handleChange,
                  onBlur: formik.handleBlur,
                  onFocus: handleInputFocus,
                }}
              />
              <label className={FORM_REGISTRATION_CHECKBOX_LABEL} htmlFor="isDefaultBillingAddress">
                {localizedAppStrings[locale][AppStrings.SetAsDefaultBillingAddress]}
              </label>
            </div>

            <label className={FORM_REGISTRATION_LABEL} htmlFor="billingStreetName">
              {localizedAppStrings[locale][AppStrings.Street]}
            </label>
            <ValidationField errorMsg={billingStreetNameError}>
              <InputField
                theme="primary"
                view="primary"
                name="billingStreetName"
                id="billingStreetName"
                value={formik.values.billingStreetName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                onFocus={handleInputFocus}
                invalid={!!billingStreetNameError}
                disabled={formik.values.isTheSameAddressAsShipping}
              />
            </ValidationField>

            <label className={FORM_REGISTRATION_LABEL} htmlFor="billingCity">
              {localizedAppStrings[locale][AppStrings.City]}
            </label>
            <ValidationField errorMsg={billingCityError}>
              <InputField
                theme="primary"
                view="primary"
                name="billingCity"
                id="billingCity"
                value={formik.values.billingCity}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                onFocus={handleInputFocus}
                invalid={!!billingCityError}
                disabled={formik.values.isTheSameAddressAsShipping}
              />
            </ValidationField>

            <label className={FORM_REGISTRATION_LABEL} htmlFor="billingPostalCode">
              {localizedAppStrings[locale][AppStrings.PostalCode]}
            </label>
            <ValidationField errorMsg={billingPostalCodeError}>
              <InputField
                theme="primary"
                view="primary"
                name="billingPostalCode"
                id="billingPostalCode"
                value={formik.values.billingPostalCode}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                onFocus={handleInputFocus}
                invalid={!!billingPostalCodeError}
                disabled={formik.values.isTheSameAddressAsShipping}
              />
            </ValidationField>

            <label className={FORM_REGISTRATION_LABEL} htmlFor="billingCountry">
              {localizedAppStrings[locale][AppStrings.Country]}
            </label>
            <ValidationField errorMsg={billingCountryError}>
              <Select
                theme="primary"
                view="primary"
                name="billingCountry"
                id="billingCountry"
                value={formik.values.billingCountry}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                onFocus={handleInputFocus}
                options={SELECT_OPTIONS}
                invalid={!!billingCountryError}
                disabled={formik.values.isTheSameAddressAsShipping}
              />
            </ValidationField>
          </Fieldset>
          <p className={FORM_REGISTRATION_ERROR_MESSAGE}> {registrationError}</p>
          <Button
            className={FORM_REGISTRATION_BTN}
            theme="primary"
            view="primary"
            el="button"
            type="submit"
            disabled={isSubmitting}>
            {localizedAppStrings[locale][AppStrings.Register]}
          </Button>
          <p className={FORM_REGISTRATION_QUESTION}>
            {localizedAppStrings[locale][AppStrings.QAlreadyHaveAnAccount]}{' '}
            <Link relative="path" className={FORM_REGISTRATION_LINK} to={getFullPath(VIEW_LOGIN)}>
              {localizedAppStrings[locale][AppStrings.LogIn]}
            </Link>
          </p>
        </>
      )}
    </form>
  );
};

export default FormRegistration;
