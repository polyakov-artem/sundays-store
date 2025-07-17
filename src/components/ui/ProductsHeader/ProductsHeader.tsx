import { FC, FormEvent, MouseEvent, useCallback, useEffect, useMemo, useRef } from 'react';
import { TIntrinsicHeader } from '../../../types/types';
import classNames from 'classnames';
import { BLOCK } from '../../../constants/cssHelpers';
import Select from '../../shared/Select/Select';
import InputField from '../../shared/InputField/InputField';
import Button from '../../shared/Button/Button';
import { BsGrid3X2Gap, BsListTask } from 'react-icons/bs';
import { useSearchParams } from 'react-router';
import { getSelectOptions } from './getSelectOptions';
import { useSynchronizedValue } from '../../../hooks/useSynchronizedValue';
import { EMPTY_INPUT_VALUE } from '../../../constants/constants';
import {
  defaultInputConvertToParamFn,
  defaultInputConvertToStateFn,
  defaultInputOnChangeFn,
} from '../../../utils/useSynchronizedValueFns';
import { useTranslation } from 'react-i18next';
import { I18nKey } from '../../../utils/i18n/i18nKey';
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

const ProductsHeader: FC<TProductsHeaderProps> = (props) => {
  const { className, ...rest } = props;
  const classes = classNames(BLOCK, PRODUCTS_HEADER, className);
  const [params, setParams] = useSearchParams();
  const isListMode = params.get(VIEW_MODE) === VIEW_MODE_LIST;
  const formRef = useRef<HTMLFormElement>(null);
  const { t } = useTranslation();

  const {
    state: searchText,
    nextUrlValue: searchTextNextURLValue,
    handleChange: handleSearchTextChange,
  } = useSynchronizedValue({
    defaultState: EMPTY_INPUT_VALUE,
    params,
    urlParamName: SEARCH_TEXT,
    onChangeFn: defaultInputOnChangeFn,
    convertToStateFn: defaultInputConvertToStateFn,
    convertToParamFn: defaultInputConvertToParamFn,
  });

  const {
    state: sorting,
    nextUrlValue: sortingNextURLValue,
    handleChange: handleSortingChange,
  } = useSynchronizedValue({
    params,
    urlParamName: SORTING,
    defaultState: EMPTY_INPUT_VALUE,
    onChangeFn: defaultInputOnChangeFn,
    convertToStateFn: defaultInputConvertToStateFn,
    convertToParamFn: defaultInputConvertToParamFn,
  });

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

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      const filters = [
        [SORTING, sortingNextURLValue],
        [SEARCH_TEXT, searchTextNextURLValue],
      ] as const;

      if (filters.some(([_key, value]) => value !== undefined)) {
        setParams((params) => {
          filters.forEach(([key, nextUrlValue]) => {
            if (nextUrlValue) {
              params.set(key, nextUrlValue);
            } else if (nextUrlValue === null) {
              params.delete(key);
            }
          });
          return params;
        });
      }
    },
    [setParams, sortingNextURLValue, searchTextNextURLValue]
  );

  const selectOptions = useMemo(() => getSelectOptions(t), [t]);

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
            placeholder={t(I18nKey.SearchForProduct)}
            value={searchText}
            onChange={handleSearchTextChange}
          />
          <Button
            type="submit"
            el="button"
            view="primary"
            theme="primary"
            size="sm"
            className={PRODUCTS_HEADER_SEARCH_BTN}>
            {t(I18nKey.Search)}
          </Button>
        </div>
        <div className={PRODUCTS_HEADER_SORTING}>
          <label className={PRODUCTS_HEADER_LABEL} htmlFor="sorting">
            {t(I18nKey.SortBy)}
          </label>
          <Select
            className={PRODUCTS_HEADER_SORTING_SELECT}
            view="primary"
            theme="primary"
            id="sorting"
            name="sorting"
            options={selectOptions}
            value={sorting}
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
