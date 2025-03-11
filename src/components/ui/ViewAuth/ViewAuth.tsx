import { FC } from 'react';
import AuthWindow from '../AuthWindow/AuthWindow';
import { TAuthProps, TIntrinsicMain } from '../../../types/types';
import './ViewAuth.scss';

export const VIEW_AUTH = 'view-auth';
export const VIEW_AUTH_WINDOW = `${VIEW_AUTH}__window`;

export type TAuthViewProps = TIntrinsicMain & TAuthProps;

const ViewAuth: FC<TAuthViewProps> = ({ type }) => {
  return (
    <main className={VIEW_AUTH}>
      <AuthWindow className={VIEW_AUTH_WINDOW} type={type} />
    </main>
  );
};

export default ViewAuth;
