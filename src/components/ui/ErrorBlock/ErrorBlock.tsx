import { FC } from 'react';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectLocale } from '../../../store/settingsSlice';
import { TIntrinsicDiv } from '../../../types/types';
import classNames from 'classnames';
import { localizedAppStrings } from '../../../constants/localizedAppStrings';
import { AppStrings } from '../../../constants/appStrings';
import { BLOCK } from '../../../constants/cssHelpers';
import './ErrorBlock.scss';

export const ERROR_BLOCK = 'error-block';
export const ERROR_BLOCK_TEXT = `${ERROR_BLOCK}__text`;

export type TErrorBlockProps = { isBlock?: boolean } & TIntrinsicDiv;

const ErrorBlock: FC<TErrorBlockProps> = (props) => {
  const { className, isBlock, ...rest } = props;
  const locale = useAppSelector(selectLocale);

  const classes = classNames({ [BLOCK]: isBlock }, ERROR_BLOCK, className);

  return (
    <div {...rest} className={classes}>
      <p className={ERROR_BLOCK_TEXT}>
        {localizedAppStrings[locale][AppStrings.SomethingWentWrong]}... :(
      </p>
    </div>
  );
};

export default ErrorBlock;
