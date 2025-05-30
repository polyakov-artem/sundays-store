import { FC, useCallback } from 'react';
import classNames from 'classnames';
import { TIntrinsicForm } from '../../../types/types';
import { useAppDispatch } from '../../../hooks/store-hooks';
import { logIn } from '../../../store/authSlice';
import { TBasicAuthData } from '../../../services/authService';
import { useSignUpMutation } from '../../../store/storeApi';
import { delay } from '../../../utils/delay';
import FormProfile from '../FormProfile/FormProfile';
import './FormRegistration.scss';

export type TFormRegistrationProps = { onSuccess?: VoidFunction } & TIntrinsicForm;

export const FORM_REGISTRATION = 'form-registration';

const FormRegistration: FC<TFormRegistrationProps> = (props) => {
  const { className, onSuccess, ...restProps } = props;
  const classes = classNames(FORM_REGISTRATION, className);
  const dispatch = useAppDispatch();
  const [register] = useSignUpMutation();

  const handleSuccessfulSubmit = useCallback(
    async ({ email, password }: TBasicAuthData) => {
      onSuccess?.();
      await delay(500);
      try {
        await dispatch(logIn({ email, password }));
      } catch {
        // ignore
      }
    },
    [dispatch, onSuccess]
  );

  return (
    <FormProfile
      className={classes}
      {...restProps}
      onSuccess={handleSuccessfulSubmit}
      submitHandler={register}
    />
  );
};

export default FormRegistration;
