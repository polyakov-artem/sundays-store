import { useCallback } from 'react';
import {
  getDefaultAddressesPath,
  TFormValues,
  TKeyBilling,
  TKeyDefaultAddresses,
  TKeyShipping,
  TSetFieldValue,
} from '../components/ui/FormProfile/formProfileUtils';

export type TUseDefaultAddressChange = {
  defaultAddresses: TFormValues[TKeyDefaultAddresses];
  type: TKeyBilling | TKeyShipping;
  setFieldValue: TSetFieldValue;
  value: string;
};

export const useDefaultAddressChange = ({
  defaultAddresses,
  type,
  setFieldValue,
  value,
}: TUseDefaultAddressChange) => {
  return useCallback(() => {
    const isChecked = defaultAddresses[type] === value;
    const formDefaultPropPath = getDefaultAddressesPath(type);

    if (isChecked) {
      void setFieldValue(formDefaultPropPath, '');
    } else {
      void setFieldValue(formDefaultPropPath, value);
    }
  }, [setFieldValue, type, defaultAddresses, value]);
};
