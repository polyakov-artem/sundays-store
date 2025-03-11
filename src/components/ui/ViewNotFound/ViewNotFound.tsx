import { FC } from 'react';
import { PUBLIC_PATH } from '../../../constants/constants';
import Button from '../../shared/Button/Button';
import './ViewNotFound.scss';

export const NOT_FOUND = 'view-not-found';
export const NOT_FOUND_WRAPPER = `${NOT_FOUND}__wrapper`;
export const NOT_FOUND_BANNER = `${NOT_FOUND}__banner`;
export const NOT_FOUND_TITLE = `${NOT_FOUND}__title`;
export const NOT_FOUND_BTN = `${NOT_FOUND}__btn`;

const ViewNotFound: FC = () => {
  return (
    <main className={NOT_FOUND}>
      <div className={NOT_FOUND_BANNER}>
        <h1 className={NOT_FOUND_TITLE}>Page was not found</h1>
        <Button
          uppercase
          className={NOT_FOUND_BTN}
          el="a"
          theme="primary"
          view="primary"
          href={`${PUBLIC_PATH}`}>
          Go to home page
        </Button>
      </div>
    </main>
  );
};

export default ViewNotFound;
