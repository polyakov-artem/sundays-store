import './SvgIcon.scss';
import classNames from 'classnames';
import { FC } from 'react';
import { TIntrinsicSVG } from '../../../types/types';

export const SVG_ICON = 'svg-icon';

export type TSvgIcon = { iconId: 'check' } & TIntrinsicSVG;

const SvgIcon: FC<TSvgIcon> = (props) => {
  const { className, iconId, ...restProps } = props;
  const classes = classNames(SVG_ICON, className);

  return (
    <svg className={classes} {...restProps}>
      <use xlinkHref={`#${iconId}`} />
    </svg>
  );
};

export default SvgIcon;
