import {
  ChangeEvent,
  FC,
  FormEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { TIntrinsicHeader } from '../../../types/types';
import classNames from 'classnames';
import { BLOCK } from '../../../constants/cssHelpers';
import Select from '../../shared/Select/Select';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectLocale } from '../../../store/settingsSlice';
import InputField from '../../shared/InputField/InputField';
import { AppStrings } from '../../../constants/appStrings';
import Button from '../../shared/Button/Button';
import { BsGrid3X2Gap, BsListTask } from 'react-icons/bs';
import { localizedAppStrings } from '../../../constants/localizedAppStrings';
import { useSearchParams } from 'react-router';
import { getSelectOptions } from './getSelectOptions';
import './ProductsHeader.scss';

export const PRODUCTS_HEADER = 'products-header';
export const PRODUCTS_HEADER_VIEW_MODS = `${PRODUCTS_HEADER}__view-mods`;
export const PRODUCTS_HEADER_FORM = `${PRODUCTS_HEADER}__form`;
export const PRODUCTS_HEADER_SORTING = `${PRODUCTS_HEADER}__sorting`;
export const PRODUCTS_HEADER_SORTING_SELECT = `${PRODUCTS_HEADER}__sorting-select`;
export const PRODUCTS_HEADER_LABEL = `${PRODUCTS_HEADER}__label`;
export const PRODUCTS_HEADER_SEARCH = `${PRODUCTS_HEADER}__search`;
export const PRODUCTS_HEADER_SEARCH_INPUT = `${PRODUCTS_HEADER}__search-input`;
export const PRODUCTS_HEADER_SEARCH_BTN = `${PRODUCTS_HEADER}__search-btn`;
export const VIEW_MODE = 'view-mode';
export const SEARCH_TEXT = 'search-text';
export const SORTING = 'sorting';
export const VIEW_MODE_LIST = 'list';
export const VIEW_MODE_TILE = 'tile';

export type TProductsHeaderProps = TIntrinsicHeader;

export interface CustomElements extends HTMLFormControlsCollection {
  searchText: HTMLInputElement;
  sorting: HTMLSelectElement;
}

export interface CustomForm extends HTMLFormElement {
  readonly elements: CustomElements;
}

const ProductsHeader: FC<TProductsHeaderProps> = (props) => {
  const { className, ...rest } = props;
  const classes = classNames(BLOCK, PRODUCTS_HEADER, className);
  const [params, setParams] = useSearchParams();
  const isListMode = params.get(VIEW_MODE) === VIEW_MODE_LIST;
  const formRef = useRef<HTMLFormElement>(null);
  const searchTextParamValue = params.get(SEARCH_TEXT);
  const sortingParamValue = params.get(SORTING);
  const [searchText, setSearchText] = useState(searchTextParamValue);
  const [sorting, setSorting] = useState(sortingParamValue);

  const locale = useAppSelector(selectLocale);

  useEffect(() => {
    setSearchText(searchTextParamValue);
  }, [searchTextParamValue]);

  useEffect(() => {
    setSorting(sortingParamValue);
  }, [sortingParamValue]);

  useEffect(() => {
    formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
  }, [sorting]);

  const handleViewModeBtnClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      setParams((params) => {
        params.set(VIEW_MODE, e.currentTarget.value);
        return params;
      });
    },
    [setParams]
  );

  const handleSortingChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    setSorting(e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent<CustomForm>) => {
      e.preventDefault();

      if (searchText !== searchTextParamValue || sorting !== sortingParamValue) {
        const trimmedSearchText = searchText?.trim();

        setParams((params) => {
          if (trimmedSearchText) {
            params.set(SEARCH_TEXT, trimmedSearchText);
          } else {
            params.delete(SEARCH_TEXT);
          }

          if (sorting) {
            params.set(SORTING, sorting);
          } else {
            params.delete(SORTING);
          }

          return params;
        });
      }
    },
    [setParams, searchText, sorting, searchTextParamValue, sortingParamValue]
  );

  const handleSearchTextChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.currentTarget.value);
  }, []);

  const selectOptions = useMemo(() => getSelectOptions(locale), [locale]);

  return (
    <header className={classes} {...rest}>
      <form className={PRODUCTS_HEADER_FORM} onSubmit={handleSubmit} ref={formRef}>
        <div className={PRODUCTS_HEADER_SEARCH}>
          <InputField
            className={PRODUCTS_HEADER_SEARCH_INPUT}
            view="primary"
            theme="primary"
            name="searchText"
            type="search"
            placeholder={localizedAppStrings[locale][AppStrings.SearchForProduct]}
            value={searchText || ''}
            onChange={handleSearchTextChange}
          />
          <Button
            type="submit"
            el="button"
            view="primary"
            theme="primary"
            size="sm"
            className={PRODUCTS_HEADER_SEARCH_BTN}>
            {localizedAppStrings[locale][AppStrings.Search]}
          </Button>
        </div>
        <div className={PRODUCTS_HEADER_SORTING}>
          <label className={PRODUCTS_HEADER_LABEL} htmlFor="sorting">
            {localizedAppStrings[locale][AppStrings.SortBy]}
          </label>
          <Select
            className={PRODUCTS_HEADER_SORTING_SELECT}
            view="primary"
            theme="primary"
            id="sorting"
            name="sorting"
            options={selectOptions}
            value={sorting || ''}
            onChange={handleSortingChange}
          />
        </div>
      </form>
      <div className={PRODUCTS_HEADER_VIEW_MODS}>
        <Button
          selected={!isListMode}
          view="icon"
          theme="primary"
          el="button"
          value={VIEW_MODE_TILE}
          icon={<BsGrid3X2Gap />}
          onClick={handleViewModeBtnClick}
        />
        <Button
          selected={isListMode}
          view="icon"
          el="button"
          value={VIEW_MODE_LIST}
          theme="primary"
          icon={<BsListTask />}
          onClick={handleViewModeBtnClick}
        />
      </div>
    </header>
  );
};

export default ProductsHeader;
