import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router';
import HeaderLinks from '../HeaderLinks/HeaderLinks';
import { FaRegUserCircle, FaShoppingCart } from 'react-icons/fa';
import classNames from 'classnames';
import Burger from '../../shared/Burger/Burger';
import LogoLink from '../LogoLink/LogoLink';
import { WRAPPER } from '../../../constants/cssHelpers';
import { useGetMeQuery } from '../../../store/storeApi';
import Button from '../../shared/Button/Button';
import { getFullPath } from '../../../utils/getFullPath';
import { VIEW_CART, VIEW_LOGIN, VIEW_PROFILE, VIEW_REGISTER } from '../../../routes';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectUserRole } from '../../../store/authSlice';
import { TokenRole } from '../../../services/authService';
import { getClasses } from '../../../utils/getClasses';
import { Collapse } from '../../shared/Collapse/Collapse';
import Dropdown from '../../shared/Dropdown/Dropdown';
import DropdownMenu from '../../shared/DropdownMenu/DropdownMenu';
import { PUBLIC_PATH } from '../../../constants/constants';
import './Header.scss';

export const HEADER = 'header';
export const HEADER_NAV = `${HEADER}__nav`;
export const HEADER_LOGO = `${HEADER}__logo`;
export const HEADER_MENU = `${HEADER}__menu`;
export const HEADER_USER_BUTTONS = `${HEADER}__user-buttons`;
export const HEADER_LINK = `${HEADER}__link`;
export const HEADER_LINK_TEXT = `${HEADER}__link-text`;
export const HEADER_BURGER = `${HEADER}__burger`;

const Header: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const { data: userData, isFetching, isError } = useGetMeQuery();
  const role = useAppSelector(selectUserRole);

  useEffect(() => {
    const handleDocumentClick = (event: MouseEvent) => {
      if (!(event.target instanceof Node) || !burgerRef.current) {
        return;
      }

      if (burgerRef.current.contains(event.target)) {
        setIsMenuOpen((prevState) => !prevState);
      } else {
        if (isMenuOpen) {
          setIsMenuOpen(false);
        }
      }
    };

    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleWindowResize = () => {
      setIsMenuOpen(false);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => window.removeEventListener('resize', handleWindowResize);
  }, []);

  const menuItems = useMemo(
    () => [
      <Link
        key={VIEW_PROFILE}
        className={HEADER_LINK}
        to={getFullPath(VIEW_PROFILE)}
        relative="path">
        <p className={HEADER_LINK_TEXT}>Profile</p>
      </Link>,
      <Link key={PUBLIC_PATH} className={HEADER_LINK} to={PUBLIC_PATH} relative="path">
        <p className={HEADER_LINK_TEXT}>Log out</p>
      </Link>,
    ],
    []
  );

  const userButtonsContent =
    role === TokenRole.user ? (
      <>
        <Dropdown
          trigger={
            <Button
              view="figure"
              el="button"
              theme="primary"
              text={userData && !isFetching && !isError ? `${userData.firstName}` : 'User'}
              icon={<FaRegUserCircle />}
            />
          }
          menu={<DropdownMenu position="right" items={menuItems} />}
        />

        <Button
          view="figure"
          el="link"
          theme="primary"
          to={getFullPath(VIEW_CART)}
          relative="path"
          text={'Cart'}
          icon={<FaShoppingCart />}
        />
      </>
    ) : (
      <>
        <Button
          size="sm"
          theme="primary"
          view="primary"
          el="link"
          to={getFullPath(VIEW_LOGIN)}
          relative="path">
          Log in
        </Button>

        <Button
          size="sm"
          theme="primary"
          view="primary"
          el="link"
          to={getFullPath(VIEW_REGISTER)}
          relative="path">
          Register
        </Button>
      </>
    );

  return (
    <header className={getClasses(HEADER, null, { menuOpen: isMenuOpen })}>
      <nav className={classNames(WRAPPER, HEADER_NAV)}>
        <LogoLink className={HEADER_LOGO} />
        <Collapse className={HEADER_MENU} expanded={isMenuOpen}>
          <HeaderLinks />
        </Collapse>
        <div className={HEADER_USER_BUTTONS}>{userButtonsContent}</div>
        <Burger className={HEADER_BURGER} ref={burgerRef} active={isMenuOpen} />
      </nav>
    </header>
  );
};

export default Header;
