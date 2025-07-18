import { FC, memo } from 'react';
import classNames from 'classnames';
import { TIntrinsicImg } from '../../../types/types';
import imgSrc from './img/Logo.png';
import './Logo.scss';

export const LOGO = 'logo';

const Logo: FC<TIntrinsicImg> = (props) => {
  const { className, ...restProps } = props;
  const classes = classNames(LOGO, className);

  return <img {...restProps} className={classes} src={imgSrc} alt="Logo" />;
};

export default memo(Logo);
