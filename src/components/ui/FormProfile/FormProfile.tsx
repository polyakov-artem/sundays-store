import { PropsWithChildren, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import Button from '../../shared/Button/Button';
import { TIntrinsicForm, TMyCustomerDraft } from '../../../types/types';
import { FieldArray, Form, Formik } from 'formik';
import { useAppSelector } from '../../../hooks/store-hooks';
import { TCustomError } from '../../../store/storeApi';
import { SerializedError } from '@reduxjs/toolkit';
import { validationSchema } from './validationSchema';
import { selectCountryCode, selectLocale } from '../../../store/settingsSlice';
import { localizedAppStrings } from '../../../constants/localizedAppStrings';
import { AppStrings } from '../../../constants/appStrings';
import { H3 } from '../../../constants/cssHelpers';
import ValidationField from '../../shared/ValidationField/ValidationField';
import InputField from '../../shared/InputField/InputField';
import PasswordField from '../../shared/PasswordField/PasswordField';
import {
  createInitialAddress,
  createInitialValues,
  KEY_ADDRESSES,
  KEY_DATE_OF_BIRTH,
  KEY_DEFAULT_BILLING_ADDRESS,
  KEY_DEFAULT_SHIPPING_ADDRESS,
  KEY_EMAIL,
  KEY_FIRST_NAME,
  KEY_LAST_NAME,
  KEY_PASSWORD,
  TFormValues,
} from './formProfileUtils';
import Address from '../Address/Address';
import './FormProfile.scss';

export type TSubmitResponse<T> =
  | {
      data: T;
      error?: undefined;
    }
  | {
      data?: undefined;
      error: TCustomError | SerializedError;
    };

export type TSubmitHandler<T> = (formData: TMyCustomerDraft) => Promise<TSubmitResponse<T>>;

export type TFormProfileProps<T, S = TSubmitHandler<T>> = {
  submitHandler?: S;
  onSuccess?: (formData: TMyCustomerDraft) => Promise<void> | void;
  readonly?: boolean;
} & TIntrinsicForm;

export const FORM_PROFILE = 'form-profile';
export const FORM_PROFILE_INNER = `${FORM_PROFILE}__inner`;
export const FORM_PROFILE_LABEL = `${FORM_PROFILE}__label`;
export const FORM_PROFILE_BTN = `${FORM_PROFILE}__btn`;
export const FORM_PROFILE_ERROR_MESSAGE = `${FORM_PROFILE}__error-message`;
export const FORM_PROFILE_ADDRESSES = `${FORM_PROFILE}__addresses`;
export const FORM_PROFILE_ADDRESSES_BTN = `${FORM_PROFILE}__addresses-btn`;

const FormProfile = <T,>(props: PropsWithChildren<TFormProfileProps<T>>) => {
  const { className, submitHandler, onSuccess, readonly, ...restProps } = props;
  const classes = classNames(FORM_PROFILE, className);
  const [isSending, setIsSending] = useState(false);
  const [sendingError, setSendingError] = useState('');
  const locale = useAppSelector(selectLocale);
  const formRef = useRef<HTMLFormElement>(null);
  const countryCode = useAppSelector(selectCountryCode);

  useEffect(() => {
    const form = formRef.current;
    const handleFocus = () => setSendingError('');
    form?.addEventListener('focusin', handleFocus);
    return () => form?.removeEventListener('focusin', handleFocus);
  });

  const initialValues: TFormValues = useMemo(() => {
    return createInitialValues(countryCode, 1);
  }, [countryCode]);

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={async (values) => {
        if (!submitHandler || readonly) return;

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

        const defaultShippingAddress = values[KEY_DEFAULT_SHIPPING_ADDRESS];
        const defaultBillingAddress = values[KEY_DEFAULT_BILLING_ADDRESS];
        let defaultShippingAddressIndex;
        let defaultBillingAddressIndex;

        if (defaultShippingAddress || defaultBillingAddress) {
          for (let index = 0; index < addresses.length; index++) {
            const { key } = addresses[index];

            if (key === defaultShippingAddress) {
              defaultShippingAddressIndex = index;
            } else if (key === defaultBillingAddress) {
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

        setIsSending(true);
        setSendingError('');

        const response = await submitHandler(data);

        if (response.error) {
          setSendingError((response.error as { data: string }).data);
        } else {
          await onSuccess?.(data);
        }

        setIsSending(false);
      }}>
      {({ values, setFieldValue }) => (
        <Form className={classes} {...restProps} ref={formRef}>
          <fieldset className={FORM_PROFILE_INNER} disabled={readonly}>
            <label className={FORM_PROFILE_LABEL} htmlFor={KEY_EMAIL}>
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

            <label className={FORM_PROFILE_LABEL} htmlFor={KEY_PASSWORD}>
              {localizedAppStrings[locale][AppStrings.Password]}
            </label>
            <ValidationField
              Component={PasswordField}
              componentProps={{
                inputProps: {
                  theme: 'primary',
                  view: 'primary',
                  name: KEY_PASSWORD,
                  id: KEY_PASSWORD,
                },
              }}
              fieldPropsPath={['inputProps']}
            />

            <label className={FORM_PROFILE_LABEL} htmlFor={KEY_FIRST_NAME}>
              {localizedAppStrings[locale][AppStrings.FirstName]}
            </label>
            <ValidationField
              Component={InputField}
              componentProps={{
                theme: 'primary',
                view: 'primary',
                name: KEY_FIRST_NAME,
                id: KEY_FIRST_NAME,
              }}
            />

            <label className={FORM_PROFILE_LABEL} htmlFor={KEY_LAST_NAME}>
              {localizedAppStrings[locale][AppStrings.LastName]}
            </label>
            <ValidationField
              Component={InputField}
              componentProps={{
                theme: 'primary',
                view: 'primary',
                name: KEY_LAST_NAME,
                id: KEY_LAST_NAME,
              }}
            />

            <label className={FORM_PROFILE_LABEL} htmlFor={KEY_DATE_OF_BIRTH}>
              {localizedAppStrings[locale][AppStrings.DateOfBirth]}
            </label>
            <ValidationField
              Component={InputField}
              componentProps={{
                theme: 'primary',
                view: 'primary',
                name: KEY_DATE_OF_BIRTH,
                id: KEY_DATE_OF_BIRTH,
                type: 'date',
              }}
            />

            <FieldArray
              name={KEY_ADDRESSES}
              render={(arrayHelpers) => {
                return (
                  <div className={FORM_PROFILE_ADDRESSES}>
                    <h3 className={H3}> {localizedAppStrings[locale][AppStrings.Addresses]}</h3>

                    {values[KEY_ADDRESSES].map((address, index) => (
                      <Address
                        key={address.key}
                        index={index}
                        formValues={values}
                        arrayHelpers={arrayHelpers}
                        address={address}
                        setFieldValue={setFieldValue}
                        readonly={readonly}
                      />
                    ))}
                    {!readonly && (
                      <Button
                        className={FORM_PROFILE_ADDRESSES_BTN}
                        type="button"
                        size="sm"
                        el="button"
                        view="primary"
                        theme="primary"
                        onClick={() => arrayHelpers.push(createInitialAddress(countryCode))}>
                        {localizedAppStrings[locale][AppStrings.AddNewAddress]}
                      </Button>
                    )}
                  </div>
                );
              }}
            />

            <p className={FORM_PROFILE_ERROR_MESSAGE}> {sendingError}</p>
            {!readonly && (
              <Button
                className={FORM_PROFILE_BTN}
                theme="primary"
                view="primary"
                el="button"
                type="submit"
                disabled={isSending}>
                {localizedAppStrings[locale][AppStrings.Send]}
              </Button>
            )}
          </fieldset>
        </Form>
      )}
    </Formik>
  );
};

export default FormProfile;
