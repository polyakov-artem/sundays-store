import { nanoid } from '@reduxjs/toolkit';
import { CountryCode } from '../../../types/types';
import { FormikHelpers } from 'formik';

export const KEY_EMAIL = 'email';
export const KEY_PASSWORD = 'password';
export const KEY_FIRST_NAME = 'firstName';
export const KEY_LAST_NAME = 'lastName';
export const KEY_DATE_OF_BIRTH = 'dateOfBirth';
export const KEY_DEFAULT_BILLING_ADDRESS = 'defaultBillingAddress';
export const KEY_DEFAULT_SHIPPING_ADDRESS = 'defaultShippingAddress';
export const KEY_ADDRESSES = 'addresses';
export const KEY_STREET = 'street';
export const KEY_CITY = 'city';
export const KEY_POSTAL_CODE = 'postalCode';
export const KEY_COUNTRY = 'country';

export type TFormikSetFieldValue = FormikHelpers<TFormValues>['setFieldValue'];

export type TFormValues = {
  [KEY_EMAIL]: string;
  [KEY_PASSWORD]: string;
  [KEY_FIRST_NAME]: string;
  [KEY_LAST_NAME]: string;
  [KEY_DATE_OF_BIRTH]: string;
  [KEY_DEFAULT_SHIPPING_ADDRESS]: string;
  [KEY_DEFAULT_BILLING_ADDRESS]: string;
  [KEY_ADDRESSES]: TCustomerAddress[];
};

export type TCustomerAddress = {
  key: string;
  [KEY_STREET]: string;
  [KEY_CITY]: string;
  [KEY_POSTAL_CODE]: string;
  [KEY_COUNTRY]: CountryCode;
};

export const createInitialAddress = (country: CountryCode): TCustomerAddress => {
  return {
    key: nanoid(),
    [KEY_STREET]: '',
    [KEY_CITY]: '',
    [KEY_POSTAL_CODE]: '',
    [KEY_COUNTRY]: country,
  };
};

export const createInitialValues = (
  country: CountryCode,
  addressCount: number = 0
): TFormValues => ({
  [KEY_EMAIL]: '',
  [KEY_PASSWORD]: '',
  [KEY_FIRST_NAME]: '',
  [KEY_LAST_NAME]: '',
  [KEY_DATE_OF_BIRTH]: '',
  [KEY_DEFAULT_BILLING_ADDRESS]: '',
  [KEY_DEFAULT_SHIPPING_ADDRESS]: '',
  [KEY_ADDRESSES]: Array.from({ length: addressCount }, () => createInitialAddress(country)),
});

export const getAddressPropsBasicPath = (index: number) => `${KEY_ADDRESSES}[${index}]`;

export const getAddressPropPath = ({ index, name }: { index: number; name: string }) =>
  `${getAddressPropsBasicPath(index)}.${name}]`;
