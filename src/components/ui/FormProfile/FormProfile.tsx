import { Dispatch, FC, memo, useCallback, useEffect, useRef } from 'react';
import classNames from 'classnames';
import Button from '../../shared/Button/Button';
import { TIntrinsicForm } from '../../../types/types';
import { FieldArray, Form, Formik } from 'formik';
import { useAppSelector } from '../../../hooks/store-hooks';
import {
  emptyValidationSchema,
  signUpValidationSchema,
  updateValidationSchema,
} from './validationSchema';
import { selectCountryCode } from '../../../store/settingsSlice';
import { FIELD_GROUP, H3 } from '../../../constants/cssHelpers';
import ValidationField from '../../shared/ValidationField/ValidationField';
import InputField from '../../shared/InputField/InputField';
import PasswordField from '../../shared/PasswordField/PasswordField';
import {
  createInitialAddress,
  KEY_ADDRESSES,
  KEY_DATE_OF_BIRTH,
  KEY_EMAIL,
  KEY_FIRST_NAME,
  KEY_LAST_NAME,
  KEY_PASSWORD,
  FormMode,
  TFormValues,
  KEY_NEW_PASSWORD,
  KEY_CHANGE_PASSWORD,
} from './formProfileUtils';
import Address from '../Address/Address';
import CheckboxField from '../../shared/CheckboxField/CheckboxField';
import './FormProfile.scss';
import { useTranslation } from 'react-i18next';
import { I18nKey } from '../../../utils/i18n/i18nKey';

export type TFormProfileProps = {
  formInitialValues: TFormValues;
  mode: FormMode;
  isSubmitting?: boolean;
  error?: string;
  onFormSubmit?: (values: TFormValues) => Promise<void>;
  setError?: Dispatch<React.SetStateAction<string>>;
} & TIntrinsicForm;

export const FORM_PROFILE = 'form-profile';
export const FORM_PROFILE_INNER = `${FORM_PROFILE}__inner`;
export const FORM_PROFILE_LABEL = `${FORM_PROFILE}__label`;
export const FORM_PROFILE_BTN = `${FORM_PROFILE}__btn`;
export const FORM_PROFILE_ERROR_MESSAGE = `${FORM_PROFILE}__error-message`;
export const FORM_PROFILE_ADDRESSES = `${FORM_PROFILE}__addresses`;
export const FORM_PROFILE_ADDRESSES_BTN = `${FORM_PROFILE}__addresses-btn`;
export const FORM_PROFILE_PASSWORD_BLOCK = `${FORM_PROFILE}__password-block`;
export const FORM_PROFILE_CHANGE_PASSWORD = `${FORM_PROFILE}__change-password`;

const FormProfile: FC<TFormProfileProps> = (props) => {
  const {
    className,
    formInitialValues,
    mode,
    isSubmitting,
    error,
    onFormSubmit,
    setError,
    ...restProps
  } = props;
  const classes = classNames(FORM_PROFILE, className);
  const { t } = useTranslation();
  const countryCode = useAppSelector(selectCountryCode);
  const formRef = useRef<HTMLFormElement>(null);

  const isModeView = mode === FormMode.view;
  const isModeRegistration = mode === FormMode.signUp;
  const isModeUpdate = mode === FormMode.update;

  const validationSchema = isModeUpdate
    ? updateValidationSchema
    : isModeRegistration
      ? signUpValidationSchema
      : emptyValidationSchema;

  useEffect(() => {
    const form = formRef.current;
    const handleFocus = () => clearError?.();
    form?.addEventListener('focusin', handleFocus);
    return () => form?.removeEventListener('focusin', handleFocus);
  });

  const clearError = useCallback(() => setError?.(''), [setError]);

  return (
    <Formik
      initialValues={formInitialValues}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        if (!onFormSubmit || isModeView) return;
        void onFormSubmit(values);
      }}>
      {({ values, setFieldValue }) => (
        <Form className={classes} {...restProps} ref={formRef}>
          <fieldset className={FORM_PROFILE_INNER} disabled={isModeView || isSubmitting}>
            <label className={FORM_PROFILE_LABEL} htmlFor={KEY_EMAIL}>
              {t(I18nKey.Email)}
            </label>
            <ValidationField
              Component={InputField}
              componentProps={{
                theme: 'primary',
                view: 'primary',
                name: KEY_EMAIL,
                id: KEY_EMAIL,
              }}
            />

            {isModeUpdate ? (
              <div className={classNames(FIELD_GROUP, FORM_PROFILE_PASSWORD_BLOCK)}>
                <ValidationField
                  className={FORM_PROFILE_CHANGE_PASSWORD}
                  Component={CheckboxField}
                  hasValidation={false}
                  componentProps={{
                    labelContent: 'Change password',
                    checkboxProps: {
                      theme: 'primary',
                      view: 'primary',
                      controlProps: {
                        name: KEY_CHANGE_PASSWORD,
                        id: KEY_CHANGE_PASSWORD,
                      },
                    },
                  }}
                  fieldPropsPath={['checkboxProps', 'controlProps']}
                />

                <label className={FORM_PROFILE_LABEL} htmlFor={KEY_PASSWORD}>
                  {t(I18nKey.CurrentPassword)}
                </label>
                <ValidationField
                  Component={PasswordField}
                  componentProps={{
                    inputProps: {
                      theme: 'primary',
                      view: 'primary',
                      disabled: !values[KEY_CHANGE_PASSWORD],
                      name: KEY_PASSWORD,
                      id: KEY_PASSWORD,
                    },
                  }}
                  fieldPropsPath={['inputProps']}
                />

                <label className={FORM_PROFILE_LABEL} htmlFor={KEY_NEW_PASSWORD}>
                  {t(I18nKey.NewPassword)}
                </label>
                <ValidationField
                  Component={PasswordField}
                  componentProps={{
                    inputProps: {
                      theme: 'primary',
                      view: 'primary',
                      disabled: !values[KEY_CHANGE_PASSWORD],
                      name: KEY_NEW_PASSWORD,
                      id: KEY_NEW_PASSWORD,
                    },
                  }}
                  fieldPropsPath={['inputProps']}
                />
              </div>
            ) : isModeRegistration ? (
              <>
                <label className={FORM_PROFILE_LABEL} htmlFor={KEY_PASSWORD}>
                  {t(I18nKey.Password)}
                </label>
                <ValidationField
                  Component={PasswordField}
                  componentProps={{
                    inputProps: {
                      theme: 'primary',
                      view: 'primary',
                      name: KEY_PASSWORD,
                      id: KEY_PASSWORD,
                    },
                  }}
                  fieldPropsPath={['inputProps']}
                />
              </>
            ) : null}

            <label className={FORM_PROFILE_LABEL} htmlFor={KEY_FIRST_NAME}>
              {t(I18nKey.FirstName)}
            </label>
            <ValidationField
              Component={InputField}
              componentProps={{
                theme: 'primary',
                view: 'primary',
                name: KEY_FIRST_NAME,
                id: KEY_FIRST_NAME,
              }}
            />

            <label className={FORM_PROFILE_LABEL} htmlFor={KEY_LAST_NAME}>
              {t(I18nKey.LastName)}
            </label>
            <ValidationField
              Component={InputField}
              componentProps={{
                theme: 'primary',
                view: 'primary',
                name: KEY_LAST_NAME,
                id: KEY_LAST_NAME,
              }}
            />

            <label className={FORM_PROFILE_LABEL} htmlFor={KEY_DATE_OF_BIRTH}>
              {t(I18nKey.DateOfBirth)}
            </label>
            <ValidationField
              Component={InputField}
              componentProps={{
                theme: 'primary',
                view: 'primary',
                name: KEY_DATE_OF_BIRTH,
                id: KEY_DATE_OF_BIRTH,
                type: 'date',
              }}
            />

            <FieldArray
              name={KEY_ADDRESSES}
              render={(arrayHelpers) => {
                return (
                  <>
                    {(isModeView && values[KEY_ADDRESSES].length) || !isModeView ? (
                      <div className={classNames(FIELD_GROUP, FORM_PROFILE_ADDRESSES)}>
                        <h3 className={H3}>{t(I18nKey.Addresses)}</h3>

                        {values[KEY_ADDRESSES].map((address, index) => (
                          <Address
                            key={address.key}
                            index={index}
                            formValues={values}
                            arrayHelpers={arrayHelpers}
                            address={address}
                            setFieldValue={setFieldValue}
                            readonly={isModeView}
                          />
                        ))}
                        {!isModeView && (
                          <Button
                            className={FORM_PROFILE_ADDRESSES_BTN}
                            type="button"
                            size="sm"
                            el="button"
                            view="primary"
                            theme="primary"
                            onClick={() => arrayHelpers.push(createInitialAddress(countryCode))}>
                            {t(I18nKey.AddNewAddress)}
                          </Button>
                        )}
                      </div>
                    ) : null}
                  </>
                );
              }}
            />

            <p className={FORM_PROFILE_ERROR_MESSAGE}> {error}</p>
            {!isModeView && (
              <Button
                className={FORM_PROFILE_BTN}
                theme="primary"
                view="primary"
                el="button"
                type="submit"
                disabled={isSubmitting}>
                {t(I18nKey.Send)}
              </Button>
            )}
          </fieldset>
        </Form>
      )}
    </Formik>
  );
};

export default memo(FormProfile);
