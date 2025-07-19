import { FC, memo } from 'react';
import { TIntrinsicInput, TIntrinsicLabel } from '../../../types/types';
import { getClasses } from '../../../utils/getClasses';
import SvgIcon from '../SvgIcon/SvgIcon';
import './Checkbox.scss';

const CHECKBOX = 'checkbox';
const CHECKBOX_BOX = `${CHECKBOX}__box`;
const CHECKBOX_CONTROL = `${CHECKBOX}__control`;
const CHECKBOX_ICON = `${CHECKBOX}__icon`;

export type TCheckboxProps = TIntrinsicLabel & {
  view?: 'primary';
  theme?: 'primary' | 'secondary';
  invalid?: boolean;
  controlProps?: TIntrinsicInput;
};

const Checkbox: FC<TCheckboxProps> = (props) => {
  const { className, view, theme, invalid, controlProps, ...restProps } = props;
  const classes = getClasses(CHECKBOX, className, { view, theme, invalid });

  return (
    <label className={classes} data-testid="checkbox" {...restProps}>
      <input {...controlProps} type="checkbox" className={CHECKBOX_CONTROL} />
      <span className={CHECKBOX_BOX}>
        <SvgIcon className={CHECKBOX_ICON} iconId="check" />
      </span>
    </label>
  );
};

export default memo(Checkbox);
