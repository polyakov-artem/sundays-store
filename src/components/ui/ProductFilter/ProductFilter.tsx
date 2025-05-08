import { FC, FormEvent, useCallback, useMemo, useRef } from 'react';
import { TIntrinsicDiv, TProductProjectionPagedSearchParams } from '../../../types/types';
import classNames from 'classnames';
import { BLOCK, H4 } from '../../../constants/cssHelpers';
import CheckboxField from '../../shared/CheckboxField/CheckboxField';
import { useParams, useSearchParams } from 'react-router';
import Button from '../../shared/Button/Button';
import { useSearchProductProjectionsQuery } from '../../../store/storeApi';
import LoaderBlock from '../LoaderBlock/LoaderBlock';
import ErrorBlock from '../ErrorBlock/ErrorBlock';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectLocale } from '../../../store/settingsSlice';
import ColorPalette from '../ColorPalette/ColorPalette';
import { localizedAppStrings } from '../../../constants/localizedAppStrings';
import { AppStrings } from '../../../constants/appStrings';
import CheckboxList from '../CheckboxList/CheckboxList';
import './ProductFilter.scss';
import {
  defaultCheckboxConvertToParamFn,
  defaultCheckboxConvertToStateFn,
  defaultCheckboxUpdateStateFn,
  TCheckboxState,
} from '../../../utils/useSynchronizedValueFns';
import { useSynchronizedValue } from '../../../hooks/useSynchronizedValue';

export const PRODUCT_FILTER = 'product-filter';
export const PRODUCT_FILTER_FORM = `${PRODUCT_FILTER}__form`;
export const PRODUCT_FILTER_BLOCK = `${PRODUCT_FILTER}__block`;
export const PRODUCT_FILTER_BLOCK_TITLE = `${PRODUCT_FILTER}__block-title`;

export const STOCK_FILTER_NAME = 'stock';
export const STOCK_FILTER_VALUE = 'true';
export const COLOR_FILTER_NAME = 'color';
export const SIZE_FILTER_NAME = 'size';

const defaultStockFilterState = {
  [STOCK_FILTER_VALUE]: false,
};

export type TProductFilterProps = TIntrinsicDiv;

const ProductFilter: FC<TProductFilterProps> = (props) => {
  const { className, ...rest } = props;
  const classes = classNames(BLOCK, PRODUCT_FILTER, className);
  const locale = useAppSelector(selectLocale);
  const [params, setParams] = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const { id: categoryId } = useParams();

  const projectionsQueryParams = useMemo(() => {
    const params: TProductProjectionPagedSearchParams = {
      'filter.query': [`categories.id:"${categoryId}"`],
      limit: 500,
    };

    return params;
  }, [categoryId]);

  const {
    data: projectionsData,
    isFetching: areProjectionsFetching,
    isError: isProjectionsError,
  } = useSearchProductProjectionsQuery(projectionsQueryParams);

  const checkboxesDefaultState = useMemo(() => {
    const defaultColorFilterState = {} as TCheckboxState;
    const defaultSizeFilterState = {} as TCheckboxState;

    projectionsData?.results.forEach(({ masterVariant, variants }) => {
      [masterVariant, ...variants].forEach(({ attributes }) => {
        attributes?.forEach(({ name, value }) => {
          const localizedValue = value[locale];
          if (name === COLOR_FILTER_NAME && localizedValue) {
            defaultColorFilterState[localizedValue] = false;
          } else if (name === SIZE_FILTER_NAME && localizedValue) {
            defaultSizeFilterState[localizedValue] = false;
          }
        });
      });
    });

    return { defaultColorFilterState, defaultSizeFilterState };
  }, [locale, projectionsData]);

  const { defaultColorFilterState, defaultSizeFilterState } = checkboxesDefaultState;

  const {
    state: stockFilterState,
    nextUrlValue: stockFilterNextURLValue,
    handleChange: handleStockFilterChange,
  } = useSynchronizedValue({
    params,
    defaultState: defaultStockFilterState,
    urlParamName: STOCK_FILTER_NAME,
    updateStateFn: defaultCheckboxUpdateStateFn,
    convertToStateFn: defaultCheckboxConvertToStateFn,
    convertToParamFn: defaultCheckboxConvertToParamFn,
  });

  const {
    state: colorFilterState,
    nextUrlValue: colorFilterNextURLValue,
    handleChange: handleColorFilterChange,
  } = useSynchronizedValue({
    params,
    defaultState: defaultColorFilterState,
    urlParamName: COLOR_FILTER_NAME,
    updateStateFn: defaultCheckboxUpdateStateFn,
    convertToStateFn: defaultCheckboxConvertToStateFn,
    convertToParamFn: defaultCheckboxConvertToParamFn,
  });

  const {
    state: sizeFilterState,
    nextUrlValue: sizeFilterNextURLValue,
    handleChange: handleSizeFilterChange,
  } = useSynchronizedValue({
    params,
    defaultState: defaultSizeFilterState,
    urlParamName: SIZE_FILTER_NAME,
    updateStateFn: defaultCheckboxUpdateStateFn,
    convertToStateFn: defaultCheckboxConvertToStateFn,
    convertToParamFn: defaultCheckboxConvertToParamFn,
  });

  const handleSubmit = useCallback(
    (e: FormEvent) => {
      e.preventDefault();

      const filters = [
        [STOCK_FILTER_NAME, stockFilterNextURLValue],
        [COLOR_FILTER_NAME, colorFilterNextURLValue],
        [SIZE_FILTER_NAME, sizeFilterNextURLValue],
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
    [setParams, stockFilterNextURLValue, colorFilterNextURLValue, sizeFilterNextURLValue]
  );

  let dynamicFilters;

  if (areProjectionsFetching) {
    dynamicFilters = <LoaderBlock />;
  } else if (isProjectionsError) {
    dynamicFilters = <ErrorBlock />;
  } else {
    dynamicFilters = (
      <>
        {!!Object.keys(defaultColorFilterState).length && (
          <div className={PRODUCT_FILTER_BLOCK}>
            <h4 className={classNames(H4, PRODUCT_FILTER_BLOCK_TITLE)}>
              {localizedAppStrings[locale][AppStrings.Colors]}
            </h4>
            <ColorPalette
              state={colorFilterState}
              name={COLOR_FILTER_NAME}
              onStateChange={handleColorFilterChange}
            />
          </div>
        )}
        {!!Object.keys(defaultSizeFilterState).length && (
          <div className={PRODUCT_FILTER_BLOCK}>
            <h4 className={classNames(H4, PRODUCT_FILTER_BLOCK_TITLE)}>Sizes</h4>
            <CheckboxList
              name={SIZE_FILTER_NAME}
              state={sizeFilterState}
              onStateChange={handleSizeFilterChange}
            />
          </div>
        )}
      </>
    );
  }

  const handleResetBtnClick = useCallback(() => {
    const filterKeys = [STOCK_FILTER_NAME, COLOR_FILTER_NAME, SIZE_FILTER_NAME];

    const filterIsSet = filterKeys.some((key) => params.get(key));

    if (filterIsSet) {
      setParams((prev) => {
        filterKeys.forEach((key) => prev.delete(key));
        return prev;
      });
    }
  }, [setParams, params]);

  return (
    <div className={classes} {...rest}>
      <form onSubmit={handleSubmit} className={PRODUCT_FILTER_FORM} ref={formRef}>
        <div className={PRODUCT_FILTER_BLOCK}>
          <h4 className={classNames(H4, PRODUCT_FILTER_BLOCK_TITLE)}>
            {localizedAppStrings[locale][AppStrings.Availability]}
          </h4>
          <CheckboxField
            labelContent={localizedAppStrings[locale][AppStrings.OnlyProductsThatAreInStock]}
            checkboxProps={{
              theme: 'primary',
              view: 'primary',
              controlProps: {
                name: STOCK_FILTER_NAME,
                id: STOCK_FILTER_NAME,
                value: STOCK_FILTER_VALUE,
                checked: stockFilterState[STOCK_FILTER_VALUE],
                onChange: handleStockFilterChange,
              },
            }}
          />
        </div>
        {dynamicFilters}
        <Button type="submit" el="button" theme="primary" view="primary" size="sm">
          {localizedAppStrings[locale][AppStrings.Apply]}
        </Button>
        <Button
          type="button"
          el="button"
          theme="primary"
          view="primary"
          size="sm"
          onClick={handleResetBtnClick}>
          {localizedAppStrings[locale][AppStrings.Reset]}
        </Button>
      </form>
    </div>
  );
};

export default ProductFilter;
