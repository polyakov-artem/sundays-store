import {
  TChangeEmail,
  TSetFirstName,
  TSetLastName,
  TAddAddress,
  TRemoveAddress,
  TChangeAddress,
  TBaseAddress,
  TSetDefaultShippingAddress,
  TSetDefaultBillingAddress,
  TSetDateOfBirth,
} from '../types/types';

export const createChangeEmailAction = (email: string): TChangeEmail => ({
  action: 'changeEmail',
  email,
});

export const createSetFirstNameAction = (firstName: string): TSetFirstName => ({
  action: 'setFirstName',
  firstName,
});

export const createSetLastNameAction = (lastName: string): TSetLastName => ({
  action: 'setLastName',
  lastName,
});

export const createAddAddressAction = (address: TBaseAddress): TAddAddress => ({
  action: 'addAddress',
  address,
});

export const createChangeAddressAction = (
  addressKey: string,
  address: TBaseAddress
): TChangeAddress => ({
  action: 'changeAddress',
  addressKey,
  address,
});

export const createRemoveAddressAction = (addressKey: string): TRemoveAddress => ({
  action: 'removeAddress',
  addressKey,
});

export const createSetDefaultShippingAddressAction = (
  addressKey: string
): TSetDefaultShippingAddress => ({
  action: 'setDefaultShippingAddress',
  addressKey,
});

export const createSetDefaultBillingAddressAction = (
  addressKey: string
): TSetDefaultBillingAddress => ({
  action: 'setDefaultBillingAddress',
  addressKey,
});

export const createSetDateOfBirthAction = (dateOfBirth: string): TSetDateOfBirth => ({
  action: 'setDateOfBirth',
  dateOfBirth,
});
