import { ChangeEvent, FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import HeaderLinks from '../HeaderLinks/HeaderLinks';
import classNames from 'classnames';
import Burger from '../../shared/Burger/Burger';
import LogoLink from '../LogoLink/LogoLink';
import { WRAPPER } from '../../../constants/cssHelpers';
import Button from '../../shared/Button/Button';
import { getFullPath } from '../../../utils/getFullPath';
import { VIEW_LOGIN, VIEW_PROFILE, VIEW_REGISTER } from '../../../constants/constants';
import { useAppDispatch, useAppSelector } from '../../../hooks/store-hooks';
import { logOut, selectIsAuthenticating, selectUserRole } from '../../../store/userSlice';
import { TokenRole } from '../../../services/authService';
import { getClasses } from '../../../utils/getClasses';
import { Collapse } from '../../shared/Collapse/Collapse';
import Dropdown from '../../shared/Dropdown/Dropdown';
import DropdownMenu from '../../shared/DropdownMenu/DropdownMenu';
import { PUBLIC_PATH } from '../../../constants/constants';
import Select from '../../shared/Select/Select';
import { SELECT_OPTIONS } from './selectOptions';
import { changeCountry, selectCountryCode } from '../../../store/settingsSlice';
import { CountryCode } from '../../../types/types';
import CartButton from '../CartButton/CartButton';
import ProfileButton from '../ProfileButton/ProfileButton';
import { I18nKey } from '../../../utils/i18n/i18nKey';
import { useTranslation } from 'react-i18next';
import './Header.scss';

export const HEADER = 'header';
export const HEADER_NAV = `${HEADER}__nav`;
export const HEADER_LOGO = `${HEADER}__logo`;
export const HEADER_MENU = `${HEADER}__menu`;
export const HEADER_LINK = `${HEADER}__link`;
export const HEADER_LINK_TEXT = `${HEADER}__link-text`;
export const HEADER_BURGER = `${HEADER}__burger`;
export const HEADER_COUNTRY_SELECTOR = `${HEADER}__country-selector`;
export const HEADER_CART_BTN = `${HEADER}__cart-btn`;
export const HEADER_BTN_BADGE = `${HEADER}__btn-badge`;
export const HEADER_BUTTONS = `${HEADER}__buttons`;

const Header: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const role = useAppSelector(selectUserRole);
  const countryCode = useAppSelector(selectCountryCode);
  const dispatch = useAppDispatch();
  const [_, setParams] = useSearchParams();
  const isAuthenticating = useAppSelector(selectIsAuthenticating);
  const { t } = useTranslation();

  const handleCountryCodeChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      dispatch(changeCountry(e.target.value as CountryCode));
      setParams([], { replace: true });
    },
    [dispatch, setParams]
  );

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

  const handleLogoutBtnClick = useCallback(
    (e: React.MouseEvent) => {
      if (isAuthenticating) {
        return;
      }

      e.preventDefault();
      void dispatch(logOut());
    },
    [dispatch, isAuthenticating]
  );

  const menuItems = useMemo(
    () => [
      <Link
        key={VIEW_PROFILE}
        className={HEADER_LINK}
        to={getFullPath(VIEW_PROFILE)}
        relative="path">
        <p className={HEADER_LINK_TEXT}>{t(I18nKey.Profile)}</p>
      </Link>,
      <a key={PUBLIC_PATH} className={HEADER_LINK} onClick={handleLogoutBtnClick}>
        <p className={HEADER_LINK_TEXT}>{t(I18nKey.LogOut)}</p>
      </a>,
    ],
    [handleLogoutBtnClick, t]
  );

  const userButtonsContent = (
    <>
      {role === TokenRole.user ? (
        <>
          <Dropdown
            trigger={<ProfileButton />}
            menu={<DropdownMenu position="right" items={menuItems} />}
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
            {t(I18nKey.LogIn)}
          </Button>

          <Button
            size="sm"
            theme="primary"
            view="primary"
            el="link"
            to={getFullPath(VIEW_REGISTER)}
            relative="path">
            {t(I18nKey.Register)}
          </Button>
        </>
      )}
    </>
  );

  return (
    <header className={getClasses(HEADER, null, { menuOpen: isMenuOpen })}>
      <nav className={classNames(WRAPPER, HEADER_NAV)}>
        <LogoLink className={HEADER_LOGO} />
        <Collapse className={HEADER_MENU} expanded={isMenuOpen}>
          <HeaderLinks />
        </Collapse>
        <div className={HEADER_BUTTONS}>
          <Select
            className={HEADER_COUNTRY_SELECTOR}
            theme="primary"
            view="primary"
            name="shippingCountry"
            id="shippingCountry"
            value={countryCode}
            onChange={handleCountryCodeChange}
            options={SELECT_OPTIONS}
          />
          {userButtonsContent}
          <CartButton />
        </div>
        <Burger className={HEADER_BURGER} ref={burgerRef} active={isMenuOpen} />
      </nav>
    </header>
  );
};

export default Header;
