import { ComponentProps, FC } from 'react';
import { Link, LinkProps } from 'react-router';
import { getClasses } from '../../../utils/getClasses';
import { TIntrinsicButton, TIntrinsicLink } from '../../../types/types';
import './button.scss';

export const BTN = 'btn';
export const BTN_INNER = `${BTN}__inner`;

export type TButtonCustomProps = {
  theme?: 'primary';
  view?: 'primary';
  fullWidth?: boolean;
  capitalized?: boolean;
  uppercase?: boolean;
  selected?: boolean;
  bold?: boolean;
  disabled?: boolean;
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
    children,
    theme,
    view,
    fullWidth,
    capitalized,
    uppercase,
    selected,
    bold,
    el = 'button',
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
  });

  const inner = (
    <span className={BTN_INNER}>
      <span className={BTN_INNER}>{children}</span>
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
