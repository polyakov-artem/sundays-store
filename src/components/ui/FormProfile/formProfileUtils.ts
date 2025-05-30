import { nanoid } from '@reduxjs/toolkit';
import { CountryCode } from '../../../types/types';
import { FormikHelpers } from 'formik';

export const KEY_IS_DEFAULT = 'isDefault';
export const KEY_DEFAULT_ADDRESSES = 'defaultAddresses';
export const KEY_ADDRESSES = 'addresses';
export const KEY_STREET = 'street';
export const KEY_CITY = 'city';
export const KEY_POSTAL_CODE = 'postalCode';
export const KEY_COUNTRY = 'country';
export const KEY_BILLING = 'billing';
export const KEY_SHIPPING = 'shipping';
export const KEY_EMAIL = 'email';
export const KEY_PASSWORD = 'password';
export const KEY_FIRST_NAME = 'firstName';
export const KEY_LAST_NAME = 'lastName';
export const KEY_DATE_OF_BIRTH = 'dateOfBirth';
export const KEY_SAME_AS = 'sameAs';

export type TKeyBilling = typeof KEY_BILLING;
export type TKeyShipping = typeof KEY_SHIPPING;
export type TKeyDefaultAddresses = typeof KEY_DEFAULT_ADDRESSES;
export type TSetFieldValue = FormikHelpers<TFormValues>['setFieldValue'];

export type TFormValues = {
  [KEY_EMAIL]: string;
  [KEY_PASSWORD]: string;
  [KEY_FIRST_NAME]: string;
  [KEY_LAST_NAME]: string;
  [KEY_DATE_OF_BIRTH]: string;
  [KEY_DEFAULT_ADDRESSES]: {
    [KEY_BILLING]: string;
    [KEY_SHIPPING]: string;
  };
  [KEY_ADDRESSES]: {
    [KEY_SHIPPING]: TShippingAddress[];
    [KEY_BILLING]: TBillingAddress[];
  };
};

export type TBasicAddress = {
  [KEY_STREET]: string;
  [KEY_CITY]: string;
  [KEY_POSTAL_CODE]: string;
  [KEY_COUNTRY]: CountryCode;
  key: string;
};

export type TShippingAddress = TBasicAddress & { type: TKeyShipping };

export type TBillingAddress = TBasicAddress & {
  type: TKeyBilling;
  [KEY_SAME_AS]: string;
};

export const createBasicInitialAddress = (country: CountryCode) => {
  return {
    key: nanoid(),
    [KEY_STREET]: '',
    [KEY_CITY]: '',
    [KEY_POSTAL_CODE]: '',
    [KEY_COUNTRY]: country,
  };
};

export const createInitialShippingAddress = (country: CountryCode): TShippingAddress => ({
  ...createBasicInitialAddress(country),
  type: KEY_SHIPPING,
});

export const createInitialBillingAddress = (country: CountryCode): TBillingAddress => ({
  ...createBasicInitialAddress(country),
  type: KEY_BILLING,
  [KEY_SAME_AS]: '',
});

export const createInitialValues = (
  country: CountryCode,
  shippingAddressCount: number = 0,
  billingAddressCount: number = 0
) => ({
  [KEY_EMAIL]: '',
  [KEY_PASSWORD]: '',
  [KEY_FIRST_NAME]: '',
  [KEY_LAST_NAME]: '',
  [KEY_DATE_OF_BIRTH]: '',
  [KEY_DEFAULT_ADDRESSES]: {
    [KEY_BILLING]: '',
    [KEY_SHIPPING]: '',
  },
  [KEY_ADDRESSES]: {
    [KEY_BILLING]: Array.from({ length: shippingAddressCount }, () =>
      createInitialBillingAddress(country)
    ),
    [KEY_SHIPPING]: Array.from({ length: billingAddressCount }, () =>
      createInitialShippingAddress(country)
    ),
  },
});

export const getAddressesPath = (type: string) => `${KEY_ADDRESSES}.${type}`;
export const getDefaultAddressesPath = (type: string) => `${KEY_DEFAULT_ADDRESSES}.${type}`;

export const getAddressPropsBasicPath = (index: number, type: string) =>
  `${getAddressesPath(type)}[${index}]`;

export const getAddressPropPath = ({
  index,
  type,
  name,
}: {
  index: number;
  type: string;
  name: string;
}) => `${getAddressPropsBasicPath(index, type)}.${name}]`;
