import { FC } from 'react';
import { TIntrinsicSpan } from '../../../types/types';
import { getClasses } from '../../../utils/getClasses';
import './Spinner.scss';

export const SPINNER = 'spinner';
export const SPINNER_CONTAINER = `${SPINNER}__container`;

export type TSpinnerProps = TIntrinsicSpan & {
  size?: 'lg';
  theme?: 'primary';
  fullSpace?: boolean;
};

const Spinner: FC<TSpinnerProps> = (props) => {
  const { size, className, theme, fullSpace, ...rest } = props;

  const classes = getClasses(SPINNER, className, { size, fullSpace, theme });

  return (
    <span className={classes} {...rest} data-testid="spinner">
      <span className={SPINNER_CONTAINER}></span>
    </span>
  );
};

export default Spinner;
