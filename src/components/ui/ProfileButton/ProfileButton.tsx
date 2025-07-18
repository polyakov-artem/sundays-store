import { FC, memo, useEffect } from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import Button from '../../shared/Button/Button';
import classNames from 'classnames';
import { TIntrinsicButton } from '../../../types/types';
import { useLazyGetMeQuery } from '../../../store/userApi';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectUserRole } from '../../../store/userSlice';
import './ProfileButton.scss';
import { useTranslation } from 'react-i18next';
import { I18nKey } from '../../../utils/i18n/i18nKey';

export type TProfileButtonProps = TIntrinsicButton;

export const PROFILE_BUTTON = 'profile-button';

const ProfileButton: FC<TProfileButtonProps> = (props) => {
  const { className, ...rest } = props;
  const classes = classNames(PROFILE_BUTTON, className);
  const role = useAppSelector(selectUserRole);
  const { t } = useTranslation();

  const [getMe, { data, isError }] = useLazyGetMeQuery();
  const name = !isError && data ? `${data.firstName}` : t(I18nKey.User);

  useEffect(() => {
    void getMe();
  }, [getMe, role]);

  return (
    <div>
      <Button
        {...rest}
        className={classes}
        view="figure"
        el="button"
        theme="primary"
        text={name}
        icon={<FaRegUserCircle />}
      />
    </div>
  );
};

export default memo(ProfileButton);
