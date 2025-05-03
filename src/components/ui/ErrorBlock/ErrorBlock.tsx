import { FC } from 'react';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectLocale } from '../../../store/settingsSlice';
import { TIntrinsicDiv } from '../../../types/types';
import classNames from 'classnames';
import { localizedAppStrings } from '../../../constants/localizedAppStrings';
import { AppStrings } from '../../../constants/appStrings';
import { BLOCK, H3 } from '../../../constants/cssHelpers';
import './ErrorBlock.scss';

export const ERROR_BLOCK = 'error-block';

export type TErrorBlockProps = TIntrinsicDiv;

const ErrorBlock: FC<TErrorBlockProps> = (props) => {
  const { className, ...rest } = props;
  const locale = useAppSelector(selectLocale);

  const classes = classNames(BLOCK, ERROR_BLOCK, className);

  return (
    <div {...rest} className={classes}>
      <p className={H3}> {localizedAppStrings[locale][AppStrings.SomethingWentWrong]}... :(</p>
    </div>
  );
};

export default ErrorBlock;
