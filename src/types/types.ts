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

export type TProductSearchRequest = {
  query?: TSearchQuery;
  sort?: TSearchSorting[];
  limit?: number;
  offset?: number;
  markMatchingVariants?: boolean;
  productProjectionParameters?: unknown;
  facets?: unknown;
  postFilter?: TSearchQuery;
};

export type TSearchQuery = TSimpleExpressions | TCompoundExpressions;

export type TSimpleExpressions = TExact | TFullText | TPrefix | TRange | TWildcard | TExists;
export type TCompoundExpressions = TAnd | TOr | TNot | TFilter;

export type TAnd = {
  and: TSimpleExpressions[] | TCompoundExpressions[];
};

export type TOr = {
  or: TSimpleExpressions[] | TCompoundExpressions[];
};

export type TNot = {
  not: TSimpleExpressions[] | TCompoundExpressions[];
};

export type TFilter = {
  filter: TSimpleExpressions[] | TCompoundExpressions[];
};

export type TExact = {
  exact: {
    field: string;
    fieldType?: SearchFieldType;
    language?: CountryLocale;
    value?: string;
    values?: string[];
    caseInsensitive?: boolean;
  };
};

export type TFullText = {
  fullText: {
    field: string;
    fieldType?: SearchFieldType;
    language?: CountryLocale;
    value: string;
    mustMatch?: 'any' | 'all';
  };
};

export type TPrefix = {
  prefix: {
    field: string;
    fieldType?: SearchFieldType;
    language?: CountryLocale;
    value: string;
    caseInsensitive?: boolean;
  };
};

export type TRange = {
  range: {
    field: string;
    fieldType?: SearchFieldType;
    gt?: string;
    lt?: string;
    gte?: string;
    lte?: string;
  };
};
export type TWildcard = {
  wildcard: {
    field: string;
    fieldType?: SearchFieldType;
    language?: CountryLocale;
    value?: string;
    caseInsensitive?: boolean;
  };
};

export type TExists = {
  exists: {
    field: string;
    fieldType?: SearchFieldType;
  };
};

export type TSearchSorting = {
  field: string;
  language?: CountryLocale;
  order: TSearchSortOrder;
  mode?: TSearchSortMode;
  fieldType?: SearchFieldType;
  filter?: TSimpleExpressions;
};

export enum TSearchSortOrder {
  asc = 'asc',
  desc = 'desc',
}

export enum TSearchSortMode {
  min = 'min',
  max = 'max',
  avg = 'avg',
  sum = 'sum',
}

export enum SearchFieldType {
  boolean = 'boolean',
  text = 'text',
  enum = 'enum',
  lenum = 'lenum',
  number = 'number',
  money = 'money',
  date = 'date',
  datetime = 'datetime',
  time = 'time',
  reference = 'reference',
  set_boolean = 'set_boolean',
  set_text = 'set_text',
  set_ltext = 'set_ltext',
  set_enum = 'set_enum',
  set_lenum = 'set_lenum',
  set_number = 'set_number',
  set_money = 'set_money',
  set_date = 'set_date',
  set_datetime = 'set_datetime',
  set_time = 'set_time',
  set_reference = 'set_reference',
}

export type TProductPagedSearchResponse = {
  total: number;
  offset: number;
  limit: number;
  facets: unknown;
  results: TProductSearchResult[];
};

export type TProductSearchResult = {
  id: string;
  matchingVariants?: unknown;
  productProjection?: unknown;
};

export type TGetProductByIdParams = {
  id: string;
  params?: TGetProductByIdQueryParams;
};

export type TGetProductByIdQueryParams = {
  expand?: string;
  priceCurrency?: string;
  priceCountry?: string;
  priceCustomerGroup?: string;
  priceCustomerGroupAssignments?: string;
  priceChannel?: string;
};

export type TProduct = {
  id: string;
  version: number;
  key?: string;
  productType: unknown;
  masterData: unknown;
  taxCategory?: unknown;
  state?: unknown;
  reviewRatingStatistics?: TReviewRatingStatistics;
  priceMode?: unknown;
  createdAt: string;
  createdBy?: unknown;
  lastModifiedAt: string;
  lastModifiedBy?: unknown;
  warnings?: TWarningObject[];
};

export type TReviewRatingStatistics = {
  averageRating: number;
  highestRating: number;
  lowestRating: number;
  count: number;
  ratingsDistribution: unknown;
};

export type TWarningObject = {
  code: string;
  message: string;
};

export type TProductProjectionPagedSearchRequest = {
  markMatchingVariants?: string;
  'text.<locale>'?: string;
  fuzzy?: string;
  fuzzyLevel?: string;
  'filter.query'?: string;
  filter?: string;
  facet?: string;
  'filter.facets'?: string;
  sort?: string;
  expand?: string;
  limit?: string;
  offset?: string;
  staged?: string;
  priceCurrency?: string;
  priceCountry?: string;
  priceCustomerGroup?: string;
  priceCustomerGroupAssignments?: string;
  priceChannel?: string;
  localeProjection?: CountryLocale;
  storeProjection?: string;
};

export type TProductProjectionPagedSearchResponse = {
  total: number;
  offset: number;
  limit: number;
  facets?: unknown;
  results: TProductProjection[];
};

export type TProductProjection = {
  id: string;
  version: number;
  key?: string;
  productType: TProductTypeReference;
  name: TLocalizedString;
  description?: TLocalizedString;
  slug: TLocalizedString;
  categories: TCategoryReference[];
  categoryOrderHints?: unknown;
  metaTitle?: TLocalizedString;
  metaDescription?: TLocalizedString;
  metaKeywords?: TLocalizedString;
  searchKeywords?: unknown;
  hasStagedChanges?: boolean;
  published?: boolean;
  masterVariant: TProductVariant;
  variants: TProductVariant[];
  taxCategory?: unknown;
  state?: unknown;
  reviewRatingStatistics?: TReviewRatingStatistics;
  priceMode?: unknown;
  createdAt: string;
  lastModifiedAt: string;
};

export type TProductVariant = {
  id: number;
  key?: string;
  sku?: string;
  prices?: TPrice[];
  attributes?: unknown[];
  price?: TPrice;
  images?: TImage[];
  assets?: TAsset[];
  availability?: TProductVariantAvailability;
  isMatchingVariant?: boolean;
  scopedPrice?: unknown;
  scopedPriceDiscounted?: boolean;
};

export type TPrice = {
  id: string;
  key?: string;
  value: TTypedMoney;
  country?: CountryCode;
  customerGroup?: unknown;
  channel?: unknown;
  validFrom?: string;
  validUntil?: string;
  discounted?: TDiscountedPrice;
  tiers?: unknown[];
  custom?: unknown;
};

export type TTypedMoney = TCentPrecisionMoney | THighPrecisionMoney;

export type TCentPrecisionMoney = {
  centAmount: number;
  currencyCode: CurrencyCode;
  type: 'centPrecision';
  fractionDigits: number;
};

export type THighPrecisionMoney = {
  centAmount: number;
  currencyCode: CurrencyCode;
  type: 'highPrecision';
  fractionDigits: number;
  preciseAmount: number;
};

export type TDiscountedPrice = {
  value: TTypedMoney;
  discount: TProductDiscountReference;
};

export type TProductDiscountReference = {
  id: string;
  typeId: 'product-discount';
  obj?: TProductDiscount;
};

export type TProductDiscount = {
  id: string;
  version: number;
  key?: string;
  name: TLocalizedString;
  description?: TLocalizedString;
  value: unknown;
  predicate: string;
  sortOrder: string;
  isActive: boolean;
  references: TReference[];
  validFrom?: string;
  validUntil?: string;
  createdAt: string;
  createdBy?: unknown;
  lastModifiedAt: string;
  lastModifiedBy?: unknown;
};

export type TReference = {
  id: string;
  typeId: ReferenceTypeId;
};

export enum CurrencyCode {
  EUR = 'EUR',
  GBP = 'GBP',
  USD = 'USD',
}

export enum CurrencyChar {
  EUR = '€',
  GBP = '£',
  USD = '$',
}

export type TProductVariantAvailability = {
  id?: string;
  version?: number;
  channels?: unknown;
  isOnStock?: boolean;
  restockableInDays?: number;
  availableQuantity?: number;
};

export type TImage = {
  url: string;
  dimensions: TImageDimensions;
  label?: string;
};

export type TImageDimensions = {
  w: number;
  h: number;
};

export type TProductTypeReference = { id: string; typeId: ReferenceTypeId; obj?: TProductType };

export type TProductType = {
  id: string;
  version: number;
  key?: string;
  name: string;
  description: string;
  attributes?: unknown[];
  createdAt: string;
  createdBy?: unknown;
  lastModifiedAt: string;
  lastModifiedBy?: unknown;
};

export type TGetProductDiscountsParams = {
  where?: string;
  sort?: string;
  expand?: string;
  limit?: number;
  offset?: number;
  withTotal?: boolean;
  [key: `var.${string}`]: string;
};

export type TProductDiscountPagedQueryResponse = {
  limit: number;
  offset: number;
  count: number;
  total?: number;
  results: TProductDiscount[];
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
export type TIntrinsicImg = ComponentProps<'img'>;
