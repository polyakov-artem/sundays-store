import { FC } from 'react';
import { TIntrinsicSpan } from '../../../types/types';
import { getClasses } from '../../../utils/getClasses';
import './loader.scss';

export const LOADER = 'loader';
export const LOADER_CONTAINER = `${LOADER}__container`;

export type TLoaderProps = TIntrinsicSpan & {
  size?: 'lg';
  theme?: 'primary';
  fullSpace?: boolean;
};

const Loader: FC<TLoaderProps> = (props) => {
  const { size, className, theme, fullSpace, ...rest } = props;

  const classes = getClasses(LOADER, className, { size, fullSpace, theme });

  return (
    <span className={classes} {...rest} data-testid="loader">
      <span className={LOADER_CONTAINER}></span>
    </span>
  );
};

export default Loader;
