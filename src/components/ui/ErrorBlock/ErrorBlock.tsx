import { FC, memo } from 'react';
import { TIntrinsicDiv } from '../../../types/types';
import classNames from 'classnames';
import { BLOCK } from '../../../constants/cssHelpers';
import { I18nKey } from '../../../utils/i18n/i18nKey';
import { useTranslation } from 'react-i18next';
import './ErrorBlock.scss';

export const ERROR_BLOCK = 'error-block';
export const ERROR_BLOCK_TEXT = `${ERROR_BLOCK}__text`;

export type TErrorBlockProps = { isBlock?: boolean } & TIntrinsicDiv;

const ErrorBlock: FC<TErrorBlockProps> = (props) => {
  const { className, isBlock, ...rest } = props;
  const { t } = useTranslation();

  const classes = classNames({ [BLOCK]: isBlock }, ERROR_BLOCK, className);

  return (
    <div {...rest} className={classes}>
      <p className={ERROR_BLOCK_TEXT}>{t(I18nKey.SomethingWentWrong)}... :(</p>
    </div>
  );
};

export default memo(ErrorBlock);
