import { FC, memo, ReactNode } from 'react';
import { TIntrinsicDiv, TIntrinsicLabel } from '../../../types/types';
import classNames from 'classnames';
import Checkbox, { TCheckboxProps } from '../Checkbox/Checkbox';
import './CheckboxField.scss';

export const CHECKBOX_FIELD = 'checkbox-field';
export const CHECKBOX_FIELD_CHECKBOX = `${CHECKBOX_FIELD}__checkbox`;
export const CHECKBOX_FIELD_LABEL = `${CHECKBOX_FIELD}__label`;
export const CHECKBOX_FIELD_INVALID = `${CHECKBOX_FIELD}_invalid`;
export const CHECKBOX_FIELD_DISABLED = `${CHECKBOX_FIELD}_disabled`;

export type TCheckboxFieldProps = TIntrinsicDiv & {
  labelProps?: TIntrinsicLabel;
  checkboxProps?: TCheckboxProps;
  labelContent?: ReactNode;
  invalid?: boolean;
};

const CheckboxField: FC<TCheckboxFieldProps> = (props) => {
  const { className, invalid, labelProps, checkboxProps, labelContent, ...restProps } = props;
  const classes = classNames(CHECKBOX_FIELD, className, {
    [CHECKBOX_FIELD_INVALID]: !!invalid,
    [CHECKBOX_FIELD_DISABLED]: !!checkboxProps?.controlProps?.disabled,
  });

  return (
    <div className={classes} data-testid={CHECKBOX_FIELD} {...restProps}>
      <Checkbox invalid={invalid} {...checkboxProps} className={CHECKBOX_FIELD_CHECKBOX} />
      <label
        {...labelProps}
        className={CHECKBOX_FIELD_LABEL}
        htmlFor={checkboxProps?.controlProps?.id}>
        {labelContent}
      </label>
    </div>
  );
};

export default memo(CheckboxField);
