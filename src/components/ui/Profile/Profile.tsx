import { FC, useCallback, useMemo, useState } from 'react';
import { TCustomer, TCustomerUpdateAction, TIntrinsicSection } from '../../../types/types';
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

import {
  createAddAddressAction,
  createChangeEmailAction,
  createRemoveAddressAction,
  createSetDateOfBirthAction,
  createSetDefaultBillingAddressAction,
  createSetDefaultShippingAddressAction,
  createSetFirstNameAction,
  createSetLastNameAction,
} from '../../../utils/customerUpdateActionCreators';
import { toast } from 'react-toastify';
import { useChangePasswordMutation, useUpdateMyCustomerMutation } from '../../../store/userApi';
import { TCustomError } from '../../../store/axiosBaseQuery';
import { useTranslation } from 'react-i18next';
import { I18nKey } from '../../../utils/i18n/i18nKey';

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
  const [updateMyCustomer] = useUpdateMyCustomerMutation();
  const [changePassword] = useChangePasswordMutation();
  const { t } = useTranslation();

  const handleEditBtnClick = useCallback(() => {
    setFormMode(FormMode.update);
  }, []);

  const handleCancelBtnClick = useCallback(() => {
    setFormMode(FormMode.view);
    setError('');
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
        values[KEY_DEFAULT_SHIPPING_ADDRESS] = defaultShippingAddress.key;
      }
    }

    return values;
  }, [userData]);

  const handleSubmit = useCallback(
    async (values: TFormValues) => {
      const { addresses: userAddresses, version } = userData;
      let userDataVersion = version;

      const formAddresses = values[KEY_ADDRESSES].map((address) => {
        return {
          ...address,
          firstName: values[KEY_FIRST_NAME],
          lastName: values[KEY_LAST_NAME],
        };
      });

      const actions: TCustomerUpdateAction[] = [
        createChangeEmailAction(values[KEY_EMAIL]),
        createSetFirstNameAction(values[KEY_FIRST_NAME]),
        createSetLastNameAction(values[KEY_LAST_NAME]),
        createSetDateOfBirthAction(values[KEY_DATE_OF_BIRTH]),
        ...userAddresses.map(({ key }) => createRemoveAddressAction(key || '')),
        ...formAddresses.map((formAddress) => createAddAddressAction(formAddress)),
      ];

      setError('');
      setIsSubmitting(true);

      const updateResponse = await updateMyCustomer({
        version: userDataVersion,
        actions,
      });

      if (updateResponse.error) {
        setError((updateResponse.error as TCustomError).data);
        setIsSubmitting(false);
        return;
      } else {
        toast.success(t(I18nKey.UserInformationWasUpdated));
        userDataVersion = updateResponse.data.version;
      }

      const defaultAddressActions = [];

      const defaultShippingAddressKey = values[KEY_DEFAULT_SHIPPING_ADDRESS];
      const defaultBillingAddressKey = values[KEY_DEFAULT_BILLING_ADDRESS];

      if (defaultShippingAddressKey) {
        defaultAddressActions.push(
          createSetDefaultShippingAddressAction(defaultShippingAddressKey)
        );
      }

      if (defaultBillingAddressKey) {
        defaultAddressActions.push(createSetDefaultBillingAddressAction(defaultBillingAddressKey));
      }

      if (defaultAddressActions.length) {
        const defaultAddressUpdateResponse = await updateMyCustomer({
          version: userDataVersion,
          actions: defaultAddressActions,
        });

        if (defaultAddressUpdateResponse.error) {
          setError((defaultAddressUpdateResponse.error as TCustomError).data);
          setIsSubmitting(false);
          return;
        } else {
          toast.success(t(I18nKey.TheDefaultAddressesWereUpdated));
          userDataVersion = defaultAddressUpdateResponse.data.version;
        }
      }

      if (values[KEY_CHANGE_PASSWORD]) {
        const passwordUpdateResponse = await changePassword({
          version: userDataVersion,
          currentPassword: values[KEY_PASSWORD],
          newPassword: values[KEY_NEW_PASSWORD],
        });

        if (passwordUpdateResponse.error) {
          setError((passwordUpdateResponse.error as TCustomError).data);
        } else {
          toast.success(t(I18nKey.ThePasswordChanged));
        }
      }
      setIsSubmitting(false);
    },
    [userData, updateMyCustomer, t, changePassword]
  );

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
            {t(I18nKey.Edit)}
          </Button>
          <Button
            className={PROFILE_BTN}
            type="button"
            el="button"
            view="primary"
            theme="primary"
            disabled={formMode === FormMode.view || isSubmitting}
            onClick={handleCancelBtnClick}>
            {t(I18nKey.Cancel)}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Profile;
