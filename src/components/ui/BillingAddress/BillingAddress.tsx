import { ChangeEvent, FC, useCallback, useEffect, useId, useMemo } from 'react';
import {
  getAddressPropPath,
  KEY_DEFAULT_ADDRESSES,
  KEY_IS_DEFAULT,
  TFormValues,
  TSetFieldValue,
  TBillingAddress,
  KEY_SAME_AS,
  KEY_SHIPPING,
  KEY_ADDRESSES,
  KEY_CITY,
  KEY_COUNTRY,
  KEY_POSTAL_CODE,
  KEY_STREET,
} from '../FormProfile/formProfileUtils';
import Address from '../Address/Address';
import { ArrayHelpers } from 'formik';
import { TIntrinsicDiv } from '../../../types/types';
import CheckboxField from '../../shared/CheckboxField/CheckboxField';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectLocale } from '../../../store/settingsSlice';
import { localizedAppStrings } from '../../../constants/localizedAppStrings';
import { AppStrings } from '../../../constants/appStrings';
import { useDefaultAddressChange } from '../../../hooks/useDefaultAddressChange';

export type TBillingAddressProps = {
  formValues: TFormValues;
  address: TBillingAddress;
  index: number;
  arrayHelpers: ArrayHelpers;
  setFieldValue: TSetFieldValue;
} & TIntrinsicDiv;

const BillingAddress: FC<TBillingAddressProps> = (props) => {
  const { formValues, setFieldValue, address, index, arrayHelpers, ...restProps } = props;
  const { key, type } = address;
  const locale = useAppSelector(selectLocale);
  const defaultFieldId = useId();
  const sameAsShippingFieldId = useId();
  const defaultAddresses = formValues[KEY_DEFAULT_ADDRESSES];
  const defaultShippingValue = defaultAddresses[KEY_SHIPPING];
  const samesAsShippingValue = formValues[KEY_ADDRESSES][type][index][KEY_SAME_AS];

  const defaultShippingProps = useMemo(
    () =>
      formValues[KEY_ADDRESSES][KEY_SHIPPING].find(
        (address) => address.key === defaultShippingValue
      ),
    [formValues, defaultShippingValue]
  );

  const title = useMemo(
    () => `${localizedAppStrings[locale][AppStrings.BillingAddress]} #${index + 1}`,
    [index, locale]
  );

  const fieldsNames = useMemo(() => {
    return Object.fromEntries(
      Object.keys(address).map((name) => [name, getAddressPropPath({ index, type, name })])
    );
  }, [index, type, address]);

  const handleDefaultAddressChange = useDefaultAddressChange({
    defaultAddresses,
    type,
    value: key,
    setFieldValue,
  });

  const handleSameAsShippingChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const defaultShippingValue = defaultAddresses[KEY_SHIPPING];

      if (!defaultShippingValue) {
        return;
      }

      void setFieldValue(fieldsNames[KEY_SAME_AS], e.target.checked ? defaultShippingValue : '');
    },
    [setFieldValue, defaultAddresses, fieldsNames]
  );

  useEffect(() => {
    if (!defaultShippingValue && samesAsShippingValue) {
      void setFieldValue(fieldsNames[KEY_SAME_AS], '');
    }
  }, [defaultShippingValue, samesAsShippingValue, fieldsNames, setFieldValue]);

  useEffect(() => {
    if (defaultShippingProps && samesAsShippingValue) {
      ([KEY_STREET, KEY_CITY, KEY_COUNTRY, KEY_POSTAL_CODE] as const).forEach((key) => {
        if (address[key] !== defaultShippingProps[key]) {
          void setFieldValue(fieldsNames[key], defaultShippingProps[key]);
        }
      });
    }
  }, [defaultShippingProps, fieldsNames, setFieldValue, address, samesAsShippingValue]);

  const checkboxes = (
    <>
      <CheckboxField
        labelContent={localizedAppStrings[locale][AppStrings.SetAsDefaultBillingAddress]}
        checkboxProps={{
          theme: 'primary',
          view: 'primary',
          controlProps: {
            name: fieldsNames[KEY_IS_DEFAULT],
            id: defaultFieldId,
            value: key,
            onChange: handleDefaultAddressChange,
            checked: defaultAddresses[type] === key,
          },
        }}
      />

      <CheckboxField
        labelContent={localizedAppStrings[locale][AppStrings.TheSameAsTheDefaultShippingAddress]}
        checkboxProps={{
          theme: 'primary',
          view: 'primary',
          controlProps: {
            name: fieldsNames[KEY_SAME_AS],
            id: sameAsShippingFieldId,
            value: key,
            onChange: handleSameAsShippingChange,
            checked: !!samesAsShippingValue,
            disabled: !defaultShippingValue,
          },
        }}
      />
    </>
  );

  return (
    <Address
      title={title}
      checkboxes={checkboxes}
      defaultAddresses={defaultAddresses}
      formValues={formValues}
      address={address}
      index={index}
      arrayHelpers={arrayHelpers}
      setFieldValue={setFieldValue}
      sameAs={samesAsShippingValue}
      {...restProps}
    />
  );
};

export default BillingAddress;
