import { FC, memo } from 'react';
import { TIntrinsicInput, TIntrinsicLabel } from '../../../types/types';
import { getClasses } from '../../../utils/getClasses';
import './ColorCheckbox.scss';

const COLOR_CHECKBOX = 'color-checkbox';
const COLOR_CHECKBOX_BOX = `${COLOR_CHECKBOX}__box`;
const COLOR_CHECKBOX_CONTROL = `${COLOR_CHECKBOX}__control`;

export type TColorCheckboxProps = {
  controlProps?: TIntrinsicInput;
  color: string;
} & TIntrinsicLabel;

const ColorCheckbox: FC<TColorCheckboxProps> = (props) => {
  const { className, controlProps, color, ...restProps } = props;
  const classes = getClasses(COLOR_CHECKBOX, className);

  return (
    <label {...restProps} className={classes} data-testid="color-checkbox">
      <input {...controlProps} type="checkbox" className={COLOR_CHECKBOX_CONTROL} />
      <span className={COLOR_CHECKBOX_BOX} style={{ backgroundColor: color }} />
    </label>
  );
};

export default memo(ColorCheckbox);
