import { FC } from 'react';
import classNames from 'classnames';
import { TIntrinsicDiv } from '../../../types/types';
import './ValidationField.scss';

export const VALIDATION_FIELD = 'validation-field';
export const VALIDATION_FIELD_MSG = `${VALIDATION_FIELD}__message`;

export type TValidationFieldProps = TIntrinsicDiv & {
  errorMsg?: string;
};

const ValidationField: FC<TValidationFieldProps> = (props) => {
  const { className, children, errorMsg = '', ...restProps } = props;
  const classes = classNames(VALIDATION_FIELD, className);

  return (
    <div className={classes} {...restProps}>
      {children}
      <p className={VALIDATION_FIELD_MSG}>{errorMsg}&nbsp;</p>
    </div>
  );
};

export default ValidationField;
