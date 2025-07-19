import { FC, memo, useCallback, useState } from 'react';
import { TIntrinsicDiv } from '../../../types/types';
import InputField, { TInputFieldProps } from '../InputField/InputField';
import Button from '../Button/Button';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { getClasses } from '../../../utils/getClasses';
import './PasswordField.scss';

export const PASSWORD_FIELD = 'password-field';
export const PASSWORD_FIELD_BTN = `${PASSWORD_FIELD}__btn`;
export const PASSWORD_FIELD_INPUT = `${PASSWORD_FIELD}__input`;

export type TPasswordFieldProps = TIntrinsicDiv & {
  inputProps: Omit<TInputFieldProps, 'type' | 'className'>;
  textIsVisible?: boolean;
  invalid?: boolean;
};

const PasswordField: FC<TPasswordFieldProps> = (props) => {
  const { className, inputProps, invalid, textIsVisible, ...restProps } = props;
  const { theme } = inputProps;
  const classes = getClasses(PASSWORD_FIELD, className, { theme, invalid });
  const [isShown, setIsShown] = useState(textIsVisible);

  const handleBtnClick = useCallback(() => {
    setIsShown((prevState) => !prevState);
  }, []);

  return (
    <div className={classes} {...restProps}>
      <InputField
        invalid={invalid}
        {...inputProps}
        type={isShown ? 'text' : 'password'}
        className={PASSWORD_FIELD_INPUT}
      />
      <Button className={PASSWORD_FIELD_BTN} el="button" onClick={handleBtnClick} type="button">
        {isShown ? <FaEyeSlash /> : <FaEye />}
      </Button>
    </div>
  );
};

export default memo(PasswordField);
