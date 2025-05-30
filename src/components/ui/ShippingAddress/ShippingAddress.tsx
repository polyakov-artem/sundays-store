import { FC, useId, useMemo } from 'react';
import {
  getAddressPropPath,
  KEY_DEFAULT_ADDRESSES,
  KEY_IS_DEFAULT,
  TFormValues,
  TSetFieldValue,
  TShippingAddress,
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

export type TShippingAddressProps = {
  formValues: TFormValues;
  address: TShippingAddress;
  index: number;
  arrayHelpers: ArrayHelpers;
  setFieldValue: TSetFieldValue;
} & TIntrinsicDiv;

const ShippingAddress: FC<TShippingAddressProps> = (props) => {
  const { formValues, setFieldValue, address, index, arrayHelpers, ...restProps } = props;
  const { key, type } = address;
  const locale = useAppSelector(selectLocale);
  const defaultFieldId = useId();
  const defaultAddresses = formValues[KEY_DEFAULT_ADDRESSES];

  const title = useMemo(
    () => `${localizedAppStrings[locale][AppStrings.ShippingAddress]} #${index + 1}`,
    [index, locale]
  );

  const handleDefaultAddressChange = useDefaultAddressChange({
    defaultAddresses,
    type,
    value: key,
    setFieldValue,
  });

  const fieldsNames = useMemo(() => {
    return Object.fromEntries(
      [KEY_IS_DEFAULT].map((name) => [name, getAddressPropPath({ index, type, name })])
    );
  }, [index, type]);

  const checkboxes = (
    <>
      <CheckboxField
        labelContent={localizedAppStrings[locale][AppStrings.SetAsDefaultShippingAddress]}
        checkboxProps={{
          theme: 'primary',
          view: 'primary',
          controlProps: {
            name: fieldsNames[KEY_IS_DEFAULT],
            id: defaultFieldId,
            onChange: handleDefaultAddressChange,
            checked: defaultAddresses[type] === key,
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
      {...restProps}
    />
  );
};

export default ShippingAddress;
