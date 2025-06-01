import { FC, useCallback, useMemo, useState } from 'react';
import { TCustomer, TIntrinsicSection } from '../../../types/types';
import classNames from 'classnames';
import FormProfile from '../FormProfile/FormProfile';
import { BLOCK } from '../../../constants/cssHelpers';
import Button from '../../shared/Button/Button';
import './Profile.scss';
import {
  FormMode,
  KEY_ADDRESSES,
  KEY_CHANGE_PASSWORD,
  KEY_CITY,
  KEY_COUNTRY,
  KEY_DATE_OF_BIRTH,
  KEY_DEFAULT_BILLING_ADDRESS,
  KEY_DEFAULT_SHIPPING_ADDRESS,
  KEY_EMAIL,
  KEY_FIRST_NAME,
  KEY_LAST_NAME,
  KEY_NEW_PASSWORD,
  KEY_PASSWORD,
  KEY_POSTAL_CODE,
  KEY_STREET,
  TFormValues,
} from '../FormProfile/formProfileUtils';
import { delay } from '../../../utils/delay';
import { localizedAppStrings } from '../../../constants/localizedAppStrings';
import { AppStrings } from '../../../constants/appStrings';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectLocale } from '../../../store/settingsSlice';

export const PROFILE = 'profile';
export const PROFILE_INNER = `${PROFILE}__inner`;
export const PROFILE_FORM = `${PROFILE}__form`;
export const PROFILE_BUTTONS = `${PROFILE}__buttons`;
export const PROFILE_BTN = `${PROFILE}__btn`;

export type TProfileProps = { userData: TCustomer } & TIntrinsicSection;

const Profile: FC<TProfileProps> = (props) => {
  const { className, userData, ...rest } = props;
  const classes = classNames(PROFILE, className);
  const [formMode, setFormMode] = useState(FormMode.view);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const locale = useAppSelector(selectLocale);

  const handleEditBtnClick = useCallback(() => {
    setFormMode(FormMode.update);
  }, []);

  const handleCancelBtnClick = useCallback(() => {
    setFormMode(FormMode.view);
  }, []);

  const formInitialValues = useMemo(() => {
    const values: TFormValues = {
      [KEY_EMAIL]: userData.email || '',
      [KEY_CHANGE_PASSWORD]: false,
      [KEY_PASSWORD]: '',
      [KEY_NEW_PASSWORD]: '',
      [KEY_FIRST_NAME]: userData.firstName || '',
      [KEY_LAST_NAME]: userData.lastName || '',
      [KEY_DATE_OF_BIRTH]: userData.dateOfBirth || '',
      [KEY_DEFAULT_BILLING_ADDRESS]: '',
      [KEY_DEFAULT_SHIPPING_ADDRESS]: '',
      [KEY_ADDRESSES]: userData.addresses.map(({ streetName, city, postalCode, country, key }) => {
        return {
          key: key || '',
          [KEY_STREET]: streetName || '',
          [KEY_CITY]: city || '',
          [KEY_POSTAL_CODE]: postalCode || '',
          [KEY_COUNTRY]: country || '',
        };
      }),
    };

    const { defaultBillingAddressId, defaultShippingAddressId } = userData;

    if (defaultBillingAddressId) {
      const defaultBillingAddress = userData.addresses.find(
        (address) => address.id === defaultBillingAddressId
      );

      if (defaultBillingAddress && defaultBillingAddress.key) {
        values[KEY_DEFAULT_BILLING_ADDRESS] = defaultBillingAddress.key;
      }
    }

    if (defaultShippingAddressId) {
      const defaultShippingAddress = userData.addresses.find(
        (address) => address.id === defaultShippingAddressId
      );

      if (defaultShippingAddress && defaultShippingAddress.key) {
        values[KEY_DEFAULT_BILLING_ADDRESS] = defaultShippingAddress.key;
      }
    }

    return values;
  }, [userData]);

  const handleSubmit = useCallback(async () => {
    setError('');
    setIsSubmitting(true);
    await delay(500);
    setIsSubmitting(false);
    setFormMode(FormMode.view);
  }, []);

  return (
    <section className={classes} {...rest}>
      <div className={classNames(BLOCK, PROFILE_FORM)}>
        <FormProfile
          key={formMode}
          formInitialValues={formInitialValues}
          mode={formMode}
          isSubmitting={isSubmitting}
          error={error}
          onFormSubmit={handleSubmit}
          setError={setError}
        />
      </div>
      <div className={classNames(BLOCK, PROFILE_BUTTONS)}>
        <div className={PROFILE_BUTTONS}>
          <Button
            className={PROFILE_BTN}
            type="button"
            el="button"
            view="primary"
            theme="primary"
            disabled={formMode === FormMode.update}
            onClick={handleEditBtnClick}>
            {localizedAppStrings[locale][AppStrings.Edit]}
          </Button>
          <Button
            className={PROFILE_BTN}
            type="button"
            el="button"
            view="primary"
            theme="primary"
            disabled={formMode === FormMode.view || isSubmitting}
            onClick={handleCancelBtnClick}>
            {localizedAppStrings[locale][AppStrings.Cancel]}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Profile;
