import { FC, memo } from 'react';
import { TIntrinsicSpan } from '../../../types/types';
import { getClasses } from '../../../utils/getClasses';
import './ScreenLoader.scss';

export const SCREEN_LOADER = 'screen-loader';
export const SCREEN_LOADER_CONTAINER = `${SCREEN_LOADER}__container`;

export type TScreenLoaderProps = TIntrinsicSpan & {
  fullSpace?: boolean;
  type?: 'linear' | 'round';
  theme?: 'white' | 'green';
};

const ScreenLoader: FC<TScreenLoaderProps> = (props) => {
  const { className, fullSpace, type = 'linear', theme, ...rest } = props;

  const classes = getClasses(SCREEN_LOADER, className, { fullSpace, type, theme });

  return (
    <span className={classes} {...rest} data-testid="screen-loader">
      <span className={SCREEN_LOADER_CONTAINER}></span>
    </span>
  );
};

export default memo(ScreenLoader);
