import { FC } from 'react';
import { getClasses } from '../../../utils/getClasses';
import './input.scss';
import { TIntrinsicInput } from '../../../types/types';

export const INPUT = 'input';

export type TInputProps = TIntrinsicInput & {
  view?: 'primary';
  theme?: 'primary';
  invalid?: boolean;
};

const Input: FC<TInputProps> = (props) => {
  const { className, view, theme, invalid, ...restProps } = props;
  const classes = getClasses(INPUT, className, { view, theme, invalid });

  return <input className={classes} {...restProps} data-testid="input" />;
};

export default Input;
