import { ComponentProps, FC, useMemo } from 'react';
import { getClasses } from '../../../utils/getClasses';
import './Select.scss';

export const BASE_CLASS_NAME = 'select';
export const selectControlClassName = `${BASE_CLASS_NAME}__control`;
export const selectOptionClassName = `${BASE_CLASS_NAME}__option`;

export type TSelectOptions = Array<{ label: string; value: string }>;

export interface TSelectProps extends ComponentProps<'select'> {
  view?: 'primary';
  theme?: 'primary';
  invalid?: boolean;
  options?: TSelectOptions;
}

const Select: FC<TSelectProps> = (props) => {
  const { className, view, theme, invalid, options = [], ...restProps } = props;
  const classes = getClasses(BASE_CLASS_NAME, className, { view, theme, invalid });

  const optionsArray = useMemo(
    () =>
      options.map((option) => (
        <option key={option.value} className={selectOptionClassName} value={option.value}>
          {option.label}
        </option>
      )),
    [options]
  );

  return (
    <select {...restProps} className={classes}>
      {optionsArray}
    </select>
  );
};

export default Select;
