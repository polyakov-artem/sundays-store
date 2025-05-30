import { FC, ReactNode, useCallback, useId, useMemo } from 'react';
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
import { getDefaultAddressesPath, TSetFieldValue } from '../FormProfile/formProfileUtils';
import {
  getAddressPropPath,
  KEY_CITY,
  KEY_COUNTRY,
  KEY_DEFAULT_ADDRESSES,
  KEY_POSTAL_CODE,
  KEY_STREET,
  TBillingAddress,
  TFormValues,
  TShippingAddress,
} from '../FormProfile/formProfileUtils';
import './Address.scss';

export type TAddressProps = {
  title?: string;
  checkboxes?: ReactNode;
  defaultAddresses: TFormValues[typeof KEY_DEFAULT_ADDRESSES];
  formValues: TFormValues;
  address: TShippingAddress | TBillingAddress;
  index: number;
  arrayHelpers: ArrayHelpers;
  setFieldValue: TSetFieldValue;
  sameAs?: string;
} & TIntrinsicDiv;

export const ADDRESS = 'address';
export const ADDRESS_TITLE = `${ADDRESS}__title`;
export const ADDRESS_LABEL = `${ADDRESS}__label`;
export const ADDRESS_FIELDS = `${ADDRESS}__fields`;
export const ADDRESS_CHECKBOXES = `${ADDRESS}__checkboxes`;
export const ADDRESS_REMOVE_BTN = `${ADDRESS}__remove-btn`;

const Address: FC<TAddressProps> = (props) => {
  const {
    className,
    title,
    checkboxes,
    defaultAddresses,
    formValues,
    address,
    index,
    arrayHelpers,
    setFieldValue,
    sameAs,
    ...restProps
  } = props;
  const classes = classNames(ADDRESS, className);
  const { type, key } = address;
  const locale = useAppSelector(selectLocale);
  const streetFieldId = useId();
  const cityFieldId = useId();
  const postalCodeFieldId = useId();
  const countryFieldId = useId();

  const fieldsNames = useMemo(() => {
    return Object.fromEntries(
      [KEY_STREET, KEY_CITY, KEY_POSTAL_CODE, KEY_COUNTRY].map((name) => [
        name,
        getAddressPropPath({ index, type, name }),
      ])
    );
  }, [index, type]);

  const handleRemoveBtnClick = useCallback(() => {
    const isSetAsDefault = defaultAddresses[type] === key;
    if (isSetAsDefault) {
      void setFieldValue(getDefaultAddressesPath(type), '');
    }
    arrayHelpers.remove(index);
  }, [defaultAddresses, type, key, arrayHelpers, index, setFieldValue]);

  return (
    <div className={classes} {...restProps}>
      <h4 className={ADDRESS_TITLE}>{title}</h4>
      <div className={ADDRESS_CHECKBOXES}>{checkboxes}</div>
      <Button
        className={ADDRESS_REMOVE_BTN}
        type="button"
        el="button"
        theme="secondary"
        view="icon"
        icon={<FaRegTrashAlt />}
        onClick={handleRemoveBtnClick}
      />

      <fieldset className={ADDRESS_FIELDS} disabled={!!sameAs}>
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
