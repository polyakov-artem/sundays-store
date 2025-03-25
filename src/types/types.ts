import { ComponentProps } from 'react';

export type TAuthProps = {
  type: 'login' | 'register';
};

export type TCustomer = {
  id: string;
  version: 1;
  createdAt: string;
  lastModifiedAt: string;
  lastModifiedBy: {
    clientId: string;
    isPlatformClient: boolean;
  };
  createdBy: {
    clientId: string;
    isPlatformClient: boolean;
  };
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  addresses: [];
  shippingAddressIds: [];
  billingAddressIds: [];
  isEmailVerified: false;
  stores: [];
  authenticationMode: string;
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
