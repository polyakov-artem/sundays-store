import { FC, useEffect } from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import Button from '../../shared/Button/Button';
import classNames from 'classnames';
import { TIntrinsicButton } from '../../../types/types';
import { useLazyGetMeQuery } from '../../../store/userApi';
import { localizedAppStrings } from '../../../constants/localizedAppStrings';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectLocale } from '../../../store/settingsSlice';
import { AppStrings } from '../../../constants/appStrings';
import { selectUserRole } from '../../../store/userSlice';
import './ProfileButton.scss';

export type TProfileButtonProps = TIntrinsicButton;

export const PROFILE_BUTTON = 'profile-button';
export const PROFILE_BUTTON_BADGE = `${PROFILE_BUTTON}__badge`;

const ProfileButton: FC<TProfileButtonProps> = (props) => {
  const { className, ...rest } = props;
  const locale = useAppSelector(selectLocale);
  const classes = classNames(PROFILE_BUTTON, className);
  const role = useAppSelector(selectUserRole);

  const [getMe, { data, isError }] = useLazyGetMeQuery();
  const name =
    !isError && data ? `${data.firstName}` : localizedAppStrings[locale][AppStrings.User];

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

export default ProfileButton;
