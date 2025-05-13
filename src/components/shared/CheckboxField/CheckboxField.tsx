import { FC, ReactNode } from 'react';
import { TIntrinsicDiv, TIntrinsicLabel } from '../../../types/types';
import classNames from 'classnames';
import Checkbox, { TCheckboxProps } from '../Checkbox/Checkbox';
import './CheckboxField.scss';

const CHECKBOX_FIELD = 'checkbox-field';
const CHECKBOX_FIELD_CHECKBOX = `${CHECKBOX_FIELD}__checkbox`;
const CHECKBOX_FIELD_LABEL = `${CHECKBOX_FIELD}__label`;

export type TCheckboxFieldProps = TIntrinsicDiv & {
  labelProps?: TIntrinsicLabel;
  checkboxProps?: TCheckboxProps;
  labelContent?: ReactNode;
};

const CheckboxField: FC<TCheckboxFieldProps> = (props) => {
  const { className, labelProps, checkboxProps, labelContent, ...restProps } = props;
  const classes = classNames(CHECKBOX_FIELD, className);

  return (
    <div className={classes} data-testid={CHECKBOX_FIELD} {...restProps}>
      <Checkbox {...checkboxProps} className={CHECKBOX_FIELD_CHECKBOX} />
      <label
        {...labelProps}
        className={CHECKBOX_FIELD_LABEL}
        htmlFor={checkboxProps?.controlProps?.id}>
        {labelContent}
      </label>
    </div>
  );
};

export default CheckboxField;
