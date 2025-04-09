import { ComponentProps } from 'react';

export type TAuthProps = {
  type: 'login' | 'register';
};

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

export type TCategoryPagedQueryResponse = {
  limit: number;
  offset: number;
  count: number;
  total?: number;
  results: TCategory[];
};

export type TLocalizedString = Record<CountryLocale, string>;

export enum CountryLocale {
  GB = 'en-GB',
  US = 'en-US',
  DE = 'de-DE',
}

export enum CountryCode {
  'GB' = 'GB',
  'DE' = 'DE',
  'US' = 'US',
}

export type TCategoryReference = {
  id: string;
  typeId: ReferenceTypeId;
  obj?: TCategory;
};

export type TCategory = {
  id: string;
  version: number;
  key: string;
  externalId?: string;
  name: TLocalizedString;
  slug: TLocalizedString;
  description?: TLocalizedString;
  ancestors: TCategoryReference[];
  parent?: TCategoryReference;
  orderHint: string;
  metaTitle?: TLocalizedString;
  metaDescription?: TLocalizedString;
  metaKeywords?: TLocalizedString;
  assets?: TAsset[];
  custom?: unknown;
  createdAt: string;
  createdBy?: unknown;
  lastModifiedAt: string;
  lastModifiedBy?: unknown;
};

export type TAsset = {
  id: string;
  key?: string;
  sources: TAssetSource[];
  name: TLocalizedString;
  description?: TLocalizedString;
  tags?: string;
  custom?: unknown;
};

export type TAssetSource = {
  key: string;
  uri: string;
  dimensions?: TAssetDimensions;
  contentType?: string;
};

export type TAssetDimensions = {
  w: number;
  h: number;
};

export enum ReferenceTypeId {
  'approval-flow' = 'approval-flow',
  'approval-rule' = 'approval-rule',
  'associate-role' = 'associate-role',
  'attribute-group' = 'attribute-group',
  'business-unit' = 'business-unit',
  'cart' = 'cart',
  'cart-discount' = 'cart-discount',
  'category' = 'category',
  'channel' = 'channel',
  'customer' = 'customer',
  'customer-email-token' = 'customer-email-token',
  'customer-group' = 'customer-group',
  'customer-password-token' = 'customer-password-token',
  'direct-discount' = 'direct-discount',
  'discount-code' = 'discount-code',
  'extension' = 'extension',
  'inventory-entry' = 'inventory-entry',
  'key-value-document' = 'key-value-document',
  'order' = 'order',
  'order-edit' = 'order-edit',
  'payment' = 'payment',
  'product' = 'product',
  'product-discount' = 'product-discount',
  'product-price' = 'product-price',
  'product-selection' = 'product-selection',
  'product-tailoring' = 'product-tailoring',
  'product-type' = 'product-type',
  'quote' = 'quote',
  'quote-request' = 'quote-request',
  'review' = 'review',
  'shipping-method' = 'shipping-method',
  'shopping-list' = 'shopping-list',
  'staged-quote' = 'staged-quote',
  'standalone-price' = 'standalone-price',
  'state' = 'state',
  'store' = 'store',
  'subscription' = 'subscription',
  'tax-category' = 'tax-category',
  'type' = 'type',
  'zone' = 'zone',
}

export type TQueryCategoriesParams = {
  where?: string;
  sort?: string;
  expand?: string;
  limit?: number;
  offset?: number;
  withTotal?: boolean;
};

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
export type TIntrinsicSpan = ComponentProps<'span'>;
export type TIntrinsicUl = ComponentProps<'ul'>;
