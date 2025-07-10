import { FC } from 'react';
import { useGetMeQuery } from '../../../store/userApi';
import { WRAPPER } from '../../../constants/cssHelpers';
import ErrorBlock from '../ErrorBlock/ErrorBlock';
import LoaderBlock from '../LoaderBlock/LoaderBlock';
import Profile from '../Profile/Profile';
import './ViewProfile.scss';

export const VIEW_PROFILE = 'view-profile';

const ViewProfile: FC = () => {
  const { isError: isProfileError, data: userData } = useGetMeQuery();

  let content;

  if (!userData) {
    content = <LoaderBlock />;
  } else if (isProfileError) {
    content = <ErrorBlock isBlock />;
  } else if (userData) {
    content = <Profile userData={userData} />;
  }

  return (
    <main className={VIEW_PROFILE}>
      <div className={WRAPPER}>{content}</div>
    </main>
  );
};

export default ViewProfile;
