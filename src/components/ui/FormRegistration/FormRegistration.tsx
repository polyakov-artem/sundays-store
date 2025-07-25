import { FC, memo, useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';
import { TIntrinsicForm } from '../../../types/types';
import { useAppSelector } from '../../../hooks/store-hooks';
import FormProfile from '../FormProfile/FormProfile';
import { selectCountryCode } from '../../../store/settingsSlice';
import {
  createInitialValues,
  FormMode,
  KEY_ADDRESSES,
  KEY_DATE_OF_BIRTH,
  KEY_DEFAULT_BILLING_ADDRESS,
  KEY_DEFAULT_SHIPPING_ADDRESS,
  KEY_FIRST_NAME,
  KEY_LAST_NAME,
  TFormValues,
} from '../FormProfile/formProfileUtils';
import { KEY_EMAIL, KEY_PASSWORD } from '../FormLogin/FormLogin';
import { useSignInMutation, useSignUpMutation } from '../../../store/userApi';
import { selectIsAuthenticating } from '../../../store/userSlice';
import { TCustomError } from '../../../store/axiosBaseQuery';
import './FormRegistration.scss';

export type TFormRegistrationProps = { onSuccess?: VoidFunction } & TIntrinsicForm;

export const FORM_REGISTRATION = 'form-registration';

const FormRegistration: FC<TFormRegistrationProps> = (props) => {
  const { className, onSuccess, ...restProps } = props;
  const classes = classNames(FORM_REGISTRATION, className);
  const [error, setError] = useState('');
  const countryCode = useAppSelector(selectCountryCode);
  const formInitialValues = useMemo(() => createInitialValues(countryCode, 1), [countryCode]);
  const [signIn] = useSignInMutation();
  const [signUp] = useSignUpMutation();
  const isAuthenticating = useAppSelector(selectIsAuthenticating);

  const handleSubmit = useCallback(
    async (values: TFormValues) => {
      const email = values[KEY_EMAIL];
      const password = values[KEY_PASSWORD];
      const firstName = values[KEY_FIRST_NAME];
      const lastName = values[KEY_LAST_NAME];
      const dateOfBirth = values[KEY_DATE_OF_BIRTH];

      const addresses = values[KEY_ADDRESSES].map((address) => {
        return {
          ...address,
          firstName,
          lastName,
        };
      });

      const defaultShippingAddressKey = values[KEY_DEFAULT_SHIPPING_ADDRESS];
      const defaultBillingAddressKey = values[KEY_DEFAULT_BILLING_ADDRESS];
      let defaultShippingAddressIndex;
      let defaultBillingAddressIndex;

      if (defaultShippingAddressKey || defaultBillingAddressKey) {
        for (let index = 0; index < addresses.length; index++) {
          const { key } = addresses[index];

          if (key === defaultShippingAddressKey) {
            defaultShippingAddressIndex = index;
          } else if (key === defaultBillingAddressKey) {
            defaultBillingAddressIndex = index;
          }
        }
      }

      const data = {
        firstName,
        lastName,
        email,
        password,
        dateOfBirth,
        addresses,
        defaultShippingAddress: defaultShippingAddressIndex,
        defaultBillingAddress: defaultBillingAddressIndex,
      };

      const { error: registrationError } = await signUp(data);

      if (registrationError) {
        setError((registrationError as TCustomError).data);
        return;
      }

      onSuccess?.();

      void signIn(values);
    },
    [onSuccess, signUp, signIn]
  );

  return (
    <FormProfile
      {...restProps}
      className={classes}
      formInitialValues={formInitialValues}
      mode={FormMode.signUp}
      isSubmitting={isAuthenticating}
      error={error}
      onFormSubmit={handleSubmit}
      setError={setError}
    />
  );
};

export default memo(FormRegistration);
