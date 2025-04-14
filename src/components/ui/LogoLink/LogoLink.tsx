import { FC } from 'react';
import classNames from 'classnames';
import { PUBLIC_PATH } from '../../../constants/constants';
import { TIntrinsicLink } from '../../../types/types';
import Logo from '../Logo/Logo';
import './LogoLink.scss';

export type TLogoLinkProps = Omit<TIntrinsicLink, 'href'>;

export const LOGO_LINK = 'logo-link';
export const LOGO_LINK_ICON = `${LOGO_LINK}__icon`;

const LogoLink: FC<TLogoLinkProps> = (props) => {
  const { className, ...restProps } = props;
  const classes = classNames(LOGO_LINK, className);

  return (
    <a {...restProps} className={classes} href={`${PUBLIC_PATH}`}>
      <Logo className={LOGO_LINK_ICON} />
    </a>
  );
};

export default LogoLink;
