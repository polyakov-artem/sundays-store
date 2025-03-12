import { FC, useCallback, useState } from 'react';
import { TIntrinsicDiv } from '../../../types/types';
import Input, { TInputProps } from '../Input/input';
import Button from '../Button/Button';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { getClasses } from '../../../utils/getClasses';
import './PasswordField.scss';

export const PASSWORD_FIELD = 'password-field';
export const PASSWORD_FIELD_BTN = `${PASSWORD_FIELD}__btn`;
export const PASSWORD_FIELD_INPUT = `${PASSWORD_FIELD}__input`;

export type TPasswordFieldProps = TIntrinsicDiv & {
  inputProps: Omit<TInputProps, 'type' | 'className'>;
  textIsVisible?: boolean;
};

const PasswordField: FC<TPasswordFieldProps> = (props) => {
  const { className, inputProps, textIsVisible, ...restProps } = props;
  const { theme, invalid } = inputProps;
  const classes = getClasses(PASSWORD_FIELD, className, { theme, invalid });
  const [isShown, setIsShown] = useState(textIsVisible);

  const handleBtnClick = useCallback(() => {
    setIsShown((prevState) => !prevState);
  }, []);

  return (
    <div className={classes} {...restProps}>
      <Input
        {...inputProps}
        type={isShown ? 'text' : 'password'}
        className={PASSWORD_FIELD_INPUT}
      />
      <Button className={PASSWORD_FIELD_BTN} el="button" onClick={handleBtnClick}>
        {isShown ? <FaEyeSlash /> : <FaEye />}
      </Button>
    </div>
  );
};

export default PasswordField;
