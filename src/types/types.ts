import { ComponentProps } from 'react';

export type TAuthProps = {
  type: 'login' | 'register';
};

export enum CountryCode {
  'GB' = 'GB',
  'DE' = 'DE',
  'US' = 'US',
}

export type TBaseAddress = {
  id?: string;
  key?: string;
  country: CountryCode;
  title?: string;
  salutation?: string;
  firstName?: string;
  lastName?: string;
  streetName?: string;
  streetNumber?: string;
  additionalStreetInfo?: string;
  postalCode?: string;
  city?: string;
  region?: string;
  state?: string;
  company?: string;
  department?: string;
  building?: string;
  apartment?: string;
  pOBox?: string;
  phone?: string;
  mobile?: string;
  email?: string;
  fax?: string;
  additionalAddressInfo?: string;
};

export type TAddress = TBaseAddress & { custom: unknown };

export type TCustomer = {
  id: string;
  version: number;
  key?: string;
  customerNumber?: string;
  externalId?: string;
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  title?: string;
  dateOfBirth?: Date;
  companyName?: string;
  vatId?: string;
  addresses: TAddress[];
  defaultShippingAddressId?: string;
  shippingAddressIds?: string[];
  defaultBillingAddressId?: string;
  billingAddressIds?: string[];
  isEmailVerified: boolean;
  customerGroup?: 'Password';
  locale?: string;
  salutation?: string;
  stores: [];
  authenticationMode: '';
  customerGroupAssignments?: unknown;
  custom?: unknown;
  createdAt: string;
  createdBy?: unknown;
  lastModifiedAt: string;
  LastModifiedBy?: unknown;
};

export type TCustomerDraft = {
  key: string;
  customerNumber: string;
  externalId?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  title: string;
  anonymousCart?: unknown;
  anonymousId?: string;
  dateOfBirth: string;
  companyName?: string;
  vatId?: string;
  addresses: TBaseAddress[];
  defaultShippingAddress: number;
  shippingAddresses: number[];
  defaultBillingAddress: number;
  billingAddresses: number[];
  isEmailVerified: boolean;
  customerGroup?: unknown;
  locale: string;
  salutation?: string;
  stores?: unknown[];
  authenticationMode: 'Password';
  customerGroupAssignments?: unknown;
  custom?: unknown;
};

export type TMyCustomerDraft = {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  middleName?: string;
  title?: string;
  salutation?: string;
  dateOfBirth?: string;
  companyName?: string;
  vatId?: string;
  addresses?: TBaseAddress[];
  defaultShippingAddress?: number;
  defaultBillingAddress?: number;
  locale?: string;
  stores?: [];
  custom?: unknown;
};

export type TCart = object;
export type TCustomerSignInResult = TCustomer & Partial<TCart>;

export type TIntrinsicFooter = ComponentProps<'footer'>;
export type TIntrinsicHeader = ComponentProps<'header'>;
export type TIntrinsicMain = ComponentProps<'main'>;
export type TIntrinsicDiv = ComponentProps<'div'>;
export type TIntrinsicArticle = ComponentProps<'article'>;
export type TIntrinsicSection = ComponentProps<'section'>;
export type TIntrinsicButton = ComponentProps<'button'>;
export type TIntrinsicLink = ComponentProps<'a'>;
export type TIntrinsicInput = ComponentProps<'input'>;
export type TIntrinsicForm = ComponentProps<'form'>;
export type TIntrinsicSVG = ComponentProps<'svg'>;
export type TIntrinsicLabel = ComponentProps<'label'>;
export type TIntrinsicFieldset = ComponentProps<'fieldset'>;
