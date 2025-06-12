import { FC } from 'react';
import { getClasses } from '../../../utils/getClasses';
import { TIntrinsicInput } from '../../../types/types';
import './InputField.scss';

export const INPUT_FIELD = 'input-field';

export type TInputFieldProps = TIntrinsicInput & {
  view?: 'primary';
  theme?: 'primary';
  invalid?: boolean;
  scale?: 'sm';
};

const InputField: FC<TInputFieldProps> = (props) => {
  const { className, view, theme, invalid, scale, ...restProps } = props;
  const classes = getClasses(INPUT_FIELD, className, { view, theme, invalid, scale });

  return <input className={classes} {...restProps} data-testid="input-field" />;
};

export default InputField;
