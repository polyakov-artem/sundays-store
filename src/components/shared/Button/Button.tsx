import { ComponentProps, FC, ReactNode } from 'react';
import { Link, LinkProps } from 'react-router';
import { getClasses } from '../../../utils/getClasses';
import { TIntrinsicButton, TIntrinsicLink } from '../../../types/types';
import './Button.scss';

export const BTN = 'btn';
export const BTN_INNER = `${BTN}__inner`;
export const BTN_TEXT = `${BTN}__text`;
export const BTN_ICON = `${BTN}__icon`;

export type TButtonCustomProps = {
  size?: 'sm';
  theme?: 'primary';
  view?: 'primary' | 'figure' | 'icon';
  icon?: ReactNode;
  text?: ReactNode;
  fullWidth?: boolean;
  capitalized?: boolean;
  uppercase?: boolean;
  selected?: boolean;
  bold?: boolean;
  disabled?: boolean;
  iconBefore?: boolean;
};

export type TButtonProps = (
  | (TIntrinsicButton & { el: 'button' })
  | (LinkProps & { el: 'link' })
  | (TIntrinsicLink & { el: 'a' })
) &
  TButtonCustomProps;

const Button: FC<TButtonProps> = (props) => {
  const {
    className,
    text,
    icon,
    theme,
    view,
    fullWidth,
    capitalized,
    uppercase,
    selected,
    bold,
    el = 'button',
    size,
    iconBefore,
    ...restProps
  } = props;
  const classes = getClasses(BTN, className, {
    theme,
    view,
    fullWidth,
    capitalized,
    uppercase,
    bold,
    selected,
    disabled: props.disabled,
    size,
    iconBefore,
  });

  const inner = (
    <span className={BTN_INNER}>
      <span className={BTN_INNER}>
        {text && <span className={BTN_TEXT}>{text}</span>}
        {icon && <span className={BTN_ICON}>{icon}</span>}
      </span>
    </span>
  );

  const elProps = { className: classes, children: inner, ...restProps };

  if (el === 'button') {
    return <button {...(elProps as ComponentProps<'button'>)} />;
  }

  if (el === 'link') {
    return <Link {...(elProps as LinkProps)} />;
  }

  if (el === 'a') {
    return <a {...(elProps as ComponentProps<'a'>)} />;
  }
};

export default Button;
