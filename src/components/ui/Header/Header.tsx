import { ChangeEvent, FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import HeaderLinks from '../HeaderLinks/HeaderLinks';
import { FaRegUserCircle, FaShoppingCart } from 'react-icons/fa';
import classNames from 'classnames';
import Burger from '../../shared/Burger/Burger';
import LogoLink from '../LogoLink/LogoLink';
import { WRAPPER } from '../../../constants/cssHelpers';
import { useGetMeQuery, useGetMyActiveCartQuery } from '../../../store/storeApi';
import Button from '../../shared/Button/Button';
import { getFullPath } from '../../../utils/getFullPath';
import { VIEW_CART, VIEW_LOGIN, VIEW_PROFILE, VIEW_REGISTER } from '../../../constants/constants';
import { useAppDispatch, useAppSelector } from '../../../hooks/store-hooks';
import { logOut, selectUserRole } from '../../../store/authSlice';
import { TokenRole } from '../../../services/authService';
import { getClasses } from '../../../utils/getClasses';
import { Collapse } from '../../shared/Collapse/Collapse';
import Dropdown from '../../shared/Dropdown/Dropdown';
import DropdownMenu from '../../shared/DropdownMenu/DropdownMenu';
import { PUBLIC_PATH } from '../../../constants/constants';
import Select from '../../shared/Select/Select';
import { SELECT_OPTIONS } from './selectOptions';
import { countryChanged, selectCountryCode, selectLocale } from '../../../store/settingsSlice';
import { CountryCode } from '../../../types/types';
import { localizedAppStrings } from '../../../constants/localizedAppStrings';
import { AppStrings } from '../../../constants/appStrings';
import { skipToken } from '@reduxjs/toolkit/query';
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
export const HEADER_BUTTONS_WRAP = `${HEADER}__buttons-wrap`;

const Header: FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const role = useAppSelector(selectUserRole);
  const countryCode = useAppSelector(selectCountryCode);
  const dispatch = useAppDispatch();
  const locale = useAppSelector(selectLocale);
  const [_, setParams] = useSearchParams();

  const {
    data: userData,
    isFetching: isGetMeQueryFetching,
    isError: isGetMeQueryError,
  } = useGetMeQuery(role !== TokenRole.user ? skipToken : undefined);

  const { data: activeCart, isError: isActiveCartQueryError } = useGetMyActiveCartQuery(
    role === TokenRole.basic ? skipToken : undefined
  );

  const cartCount = !isActiveCartQueryError && activeCart ? activeCart.totalLineItemQuantity : 0;
  const [isLoading, setIsLoading] = useState(false);

  const handleCountryCodeChange = useCallback(
    (e: ChangeEvent<HTMLSelectElement>) => {
      dispatch(countryChanged(e.target.value as CountryCode));
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
      e.preventDefault();

      if (isLoading) {
        return;
      }

      setIsLoading(true);
      void dispatch(logOut()).then(() => setIsLoading(false));
    },
    [dispatch, isLoading]
  );

  const menuItems = useMemo(
    () => [
      <Link
        key={VIEW_PROFILE}
        className={HEADER_LINK}
        to={getFullPath(VIEW_PROFILE)}
        relative="path">
        <p className={HEADER_LINK_TEXT}>{localizedAppStrings[locale][AppStrings.Profile]}</p>
      </Link>,
      <a key={PUBLIC_PATH} className={HEADER_LINK} onClick={handleLogoutBtnClick}>
        <p className={HEADER_LINK_TEXT}>{localizedAppStrings[locale][AppStrings.LogOut]}</p>
      </a>,
    ],
    [locale, handleLogoutBtnClick]
  );

  const userButtonsContent = (
    <>
      {role === TokenRole.user ? (
        <>
          <Dropdown
            trigger={
              <Button
                view="figure"
                el="button"
                theme="primary"
                text={
                  userData && !isGetMeQueryFetching && !isGetMeQueryError
                    ? `${userData.firstName}`
                    : localizedAppStrings[locale][AppStrings.User]
                }
                icon={<FaRegUserCircle />}
              />
            }
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
            {localizedAppStrings[locale][AppStrings.LogIn]}
          </Button>

          <Button
            size="sm"
            theme="primary"
            view="primary"
            el="link"
            to={getFullPath(VIEW_REGISTER)}
            relative="path">
            {localizedAppStrings[locale][AppStrings.Register]}
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
        <div className={HEADER_BUTTONS_WRAP}>
          {userButtonsContent}
          <div className={HEADER_BUTTONS_WRAP}>
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
            <div className={HEADER_CART_BTN}>
              <Button
                view="figure"
                el="link"
                theme="primary"
                to={getFullPath(VIEW_CART)}
                relative="path"
                text={'Cart'}
                icon={<FaShoppingCart />}
              />

              {!!cartCount && <span className={HEADER_BTN_BADGE}>{cartCount}</span>}
            </div>
          </div>
        </div>
        <Burger className={HEADER_BURGER} ref={burgerRef} active={isMenuOpen} />
      </nav>
    </header>
  );
};

export default Header;
