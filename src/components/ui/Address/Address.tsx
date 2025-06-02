import { FC, useCallback, useId, useMemo } from 'react';
import classNames from 'classnames';
import ValidationField from '../../shared/ValidationField/ValidationField';
import { ArrayHelpers } from 'formik';
import { localizedAppStrings } from '../../../constants/localizedAppStrings';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectLocale } from '../../../store/settingsSlice';
import { AppStrings } from '../../../constants/appStrings';
import InputField from '../../shared/InputField/InputField';
import { TIntrinsicDiv } from '../../../types/types';
import { H3 } from '../../../constants/cssHelpers';
import { SELECT_OPTIONS } from '../FormProfile/selectOptions';
import Select from '../../shared/Select/Select';
import Button from '../../shared/Button/Button';
import { FaRegTrashAlt } from 'react-icons/fa';
import CheckboxField from '../../shared/CheckboxField/CheckboxField';
import {
  getAddressPropPath,
  KEY_CITY,
  KEY_COUNTRY,
  KEY_DEFAULT_SHIPPING_ADDRESS,
  KEY_POSTAL_CODE,
  KEY_STREET,
  TCustomerAddress,
  TFormikSetFieldValue,
  TFormValues,
} from '../FormProfile/formProfileUtils';
import { KEY_DEFAULT_BILLING_ADDRESS } from '../FormProfile/formProfileUtils';
import './Address.scss';

export type TAddressProps = {
  index: number;
  formValues: TFormValues;
  arrayHelpers: ArrayHelpers;
  address: TCustomerAddress;
  readonly?: boolean;
  setFieldValue: TFormikSetFieldValue;
} & TIntrinsicDiv;

export const ADDRESS = 'address';
export const ADDRESS_TITLE = `${ADDRESS}__title`;
export const ADDRESS_LABEL = `${ADDRESS}__label`;
export const ADDRESS_FIELDS = `${ADDRESS}__fields`;
export const ADDRESS_CHECKBOXES = `${ADDRESS}__checkboxes`;
export const ADDRESS_REMOVE_BTN = `${ADDRESS}__remove-btn`;

export const baseTitle = 'Address #';

const Address: FC<TAddressProps> = (props) => {
  const {
    className,
    formValues,
    address,
    index,
    arrayHelpers,
    readonly,
    setFieldValue,
    ...restProps
  } = props;
  const classes = classNames(ADDRESS, className);
  const { key } = address;
  const locale = useAppSelector(selectLocale);
  const streetFieldId = useId();
  const cityFieldId = useId();
  const postalCodeFieldId = useId();
  const countryFieldId = useId();
  const defaultShippingFieldId = useId();
  const defaultBillingFieldId = useId();

  const currentDefaultShippingAddress = formValues[KEY_DEFAULT_SHIPPING_ADDRESS];
  const currentDefaultBillingAddress = formValues[KEY_DEFAULT_BILLING_ADDRESS];

  const fieldsNames = useMemo(() => {
    return Object.fromEntries(
      Object.keys(address).map((name) => [name, getAddressPropPath({ index, name })])
    );
  }, [index, address]);

  const handleRemoveBtnClick = useCallback(() => {
    if (currentDefaultShippingAddress === key) {
      void setFieldValue(KEY_DEFAULT_SHIPPING_ADDRESS, '');
    }
    if (currentDefaultBillingAddress === key) {
      void setFieldValue(KEY_DEFAULT_BILLING_ADDRESS, '');
    }
    arrayHelpers.remove(index);
  }, [
    currentDefaultShippingAddress,
    currentDefaultBillingAddress,
    key,
    arrayHelpers,
    index,
    setFieldValue,
  ]);

  const handleDefaultShippingAddressChange = useCallback(() => {
    if (currentDefaultShippingAddress === key) {
      void setFieldValue(KEY_DEFAULT_SHIPPING_ADDRESS, '');
    } else {
      void setFieldValue(KEY_DEFAULT_SHIPPING_ADDRESS, key);
    }
  }, [currentDefaultShippingAddress, key, setFieldValue]);

  const handleDefaultBillingAddressChange = useCallback(() => {
    if (currentDefaultBillingAddress === key) {
      void setFieldValue(KEY_DEFAULT_BILLING_ADDRESS, '');
    } else {
      void setFieldValue(KEY_DEFAULT_BILLING_ADDRESS, key);
    }
  }, [currentDefaultBillingAddress, key, setFieldValue]);

  const title = useMemo(() => `${baseTitle}${index + 1}`, [index]);

  return (
    <div className={classes} {...restProps}>
      <h4 className={ADDRESS_TITLE}>{title}</h4>
      <div className={ADDRESS_CHECKBOXES}>
        <CheckboxField
          labelContent={localizedAppStrings[locale][AppStrings.DefaultShippingAddress]}
          checkboxProps={{
            theme: 'primary',
            view: 'primary',
            controlProps: {
              name: defaultShippingFieldId,
              id: defaultShippingFieldId,
              onChange: handleDefaultShippingAddressChange,
              value: key,
              checked: formValues[KEY_DEFAULT_SHIPPING_ADDRESS] === key,
            },
          }}
        />

        <CheckboxField
          labelContent={localizedAppStrings[locale][AppStrings.DefaultBillingAddress]}
          checkboxProps={{
            theme: 'primary',
            view: 'primary',
            controlProps: {
              name: defaultBillingFieldId,
              id: defaultBillingFieldId,
              onChange: handleDefaultBillingAddressChange,
              value: key,
              checked: formValues[KEY_DEFAULT_BILLING_ADDRESS] === key,
            },
          }}
        />
      </div>

      {!readonly && (
        <Button
          className={ADDRESS_REMOVE_BTN}
          type="button"
          el="button"
          theme="secondary"
          view="icon"
          icon={<FaRegTrashAlt />}
          onClick={handleRemoveBtnClick}
        />
      )}

      <fieldset className={ADDRESS_FIELDS}>
        <label className={classNames(H3, ADDRESS_LABEL)} htmlFor={streetFieldId}>
          {localizedAppStrings[locale][AppStrings.Street]}
        </label>
        <ValidationField
          Component={InputField}
          componentProps={{
            theme: 'primary',
            view: 'primary',
            name: fieldsNames[KEY_STREET],
            id: streetFieldId,
          }}
        />

        <label className={classNames(H3, ADDRESS_LABEL)} htmlFor={cityFieldId}>
          {localizedAppStrings[locale][AppStrings.City]}
        </label>
        <ValidationField
          Component={InputField}
          componentProps={{
            theme: 'primary',
            view: 'primary',
            name: fieldsNames[KEY_CITY],
            id: cityFieldId,
          }}
        />

        <label className={classNames(H3, ADDRESS_LABEL)} htmlFor={postalCodeFieldId}>
          {localizedAppStrings[locale][AppStrings.PostalCode]}
        </label>
        <ValidationField
          Component={InputField}
          componentProps={{
            theme: 'primary',
            view: 'primary',
            name: fieldsNames[KEY_POSTAL_CODE],
            id: postalCodeFieldId,
          }}
        />

        <label className={classNames(H3, ADDRESS_LABEL)} htmlFor={countryFieldId}>
          {localizedAppStrings[locale][AppStrings.Country]}
        </label>
        <ValidationField
          Component={Select}
          componentProps={{
            theme: 'primary',
            view: 'primary',
            name: fieldsNames[KEY_COUNTRY],
            id: countryFieldId,
            options: SELECT_OPTIONS,
          }}
        />
      </fieldset>
    </div>
  );
};

export default Address;
