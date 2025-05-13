import { FC, useCallback, useMemo } from 'react';
import {
  CountryCurrency,
  TIntrinsicDiv,
  TProductProjectionPagedSearchParams,
} from '../../../types/types';
import classNames from 'classnames';
import { BLOCK, H4 } from '../../../constants/cssHelpers';
import CheckboxField from '../../shared/CheckboxField/CheckboxField';
import { useParams, useSearchParams } from 'react-router';
import Button from '../../shared/Button/Button';
import { useSearchProductProjectionsQuery } from '../../../store/storeApi';
import LoaderBlock from '../LoaderBlock/LoaderBlock';
import ErrorBlock from '../ErrorBlock/ErrorBlock';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectCountryCode, selectLocale } from '../../../store/settingsSlice';
import ColorPalette from '../ColorPalette/ColorPalette';
import { localizedAppStrings } from '../../../constants/localizedAppStrings';
import { AppStrings } from '../../../constants/appStrings';
import CheckboxList from '../CheckboxList/CheckboxList';
import {
  createRangeConvertToParamFn,
  createRangeConvertToStateFn,
  defaultCheckboxConvertToParamFn,
  defaultCheckboxConvertToStateFn,
  defaultCheckboxUpdateStateFn,
  defaultRangeUpdateStateFn as defaultRangeOnChangeFn,
  TCheckboxState,
} from '../../../utils/useSynchronizedValueFns';
import { useSynchronizedValue } from '../../../hooks/useSynchronizedValue';
import { TRangeState } from '../../shared/RangeSlider/RangeSlider';
import IntervalSlider from '../../shared/IntervalSlider/IntervalSlider';
import './ProductFilter.scss';

export const PRODUCT_FILTER = 'product-filter';
export const PRODUCT_FILTER_WRAP = `${PRODUCT_FILTER}__wrap`;
export const PRODUCT_FILTER_BLOCK = `${PRODUCT_FILTER}__block`;
export const PRODUCT_FILTER_BLOCK_TITLE = `${PRODUCT_FILTER}__block-title`;
export const PRODUCT_FILTER_BUTTONS = `${PRODUCT_FILTER}__buttons`;
export const PRODUCT_FILTER_BUTTON = `${PRODUCT_FILTER}__button`;

export const STOCK_FILTER_NAME = 'stock';
export const STOCK_FILTER_VALUE = 'true';
export const COLOR_FILTER_NAME = 'color';
export const SIZE_FILTER_NAME = 'size';
export const PRICE_FILTER_NAME = 'price';
export const MIN_VALUE_CONTROL_NAME = 'min-price';
export const MAX_VALUE_CONTROL_NAME = 'max-price';

const defaultStockFilterState = {
  [STOCK_FILTER_VALUE]: false,
};

const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 100000000;

export type TProductFilterProps = TIntrinsicDiv;

const ProductFilter: FC<TProductFilterProps> = (props) => {
  const { className, ...rest } = props;
  const classes = classNames(BLOCK, PRODUCT_FILTER, className);
  const locale = useAppSelector(selectLocale);
  const [params, setParams] = useSearchParams();
  const { id: categoryId } = useParams();
  const countryCode = useAppSelector(selectCountryCode);

  const projectionsQueryParams = useMemo(() => {
    const params: TProductProjectionPagedSearchParams = {
      'filter.query': [`categories.id:"${categoryId}"`],
      markMatchingVariants: true,
      priceCurrency: CountryCurrency[countryCode],
      priceCountry: countryCode,
      limit: 500,
    };

    return params;
  }, [categoryId, countryCode]);

  const {
    data: projectionsData,
    isFetching: areProjectionsFetching,
    isError: isProjectionsError,
  } = useSearchProductProjectionsQuery(projectionsQueryParams);

  const attributes = useMemo(() => {
    const colorsData = new Set<string>();
    const sizesData = new Set<string>();
    const prices: number[] = [];
    let priceFrDigits = 0;

    projectionsData?.results.forEach(({ masterVariant, variants }) => {
      [masterVariant, ...variants].forEach((variant) => {
        const { priceData, attributes } = variant;
        if (priceData) {
          prices.push(priceData.currentPrice);
          if (!priceFrDigits) {
            priceFrDigits = variant.scopedPrice.currentValue.fractionDigits;
          }
        }
        attributes?.forEach(({ name, value }) => {
          const localizedValue = value[locale];
          if (name === COLOR_FILTER_NAME && localizedValue) {
            colorsData.add(localizedValue);
          } else if (name === SIZE_FILTER_NAME && localizedValue) {
            sizesData.add(localizedValue);
          }
        });
      });
    });

    prices.sort((a, b) => a - b);
    const minPrice = prices.length ? Math.floor(prices[0]) : DEFAULT_MIN_PRICE;
    const maxPrice = prices.length ? Math.ceil(prices[prices.length - 1]) : DEFAULT_MAX_PRICE;

    return { colorsData, sizesData, minPrice, maxPrice, priceFrDigits };
  }, [locale, projectionsData]);

  const { colorsData, sizesData, minPrice, maxPrice, priceFrDigits } = attributes;

  const priceFilterDefaultState: TRangeState = useMemo(() => {
    return {
      minValue: minPrice,
      maxValue: maxPrice,
      values: [minPrice, maxPrice],
    };
  }, [minPrice, maxPrice]);

  const rangeConvertToStateFn = useMemo(
    () =>
      createRangeConvertToStateFn((value) => {
        return value.split(';').map((str) => str.slice(0, -priceFrDigits));
      }),

    [priceFrDigits]
  );

  const rangeConvertToParamFn = useMemo(
    () =>
      createRangeConvertToParamFn((state) => {
        return state.values
          .map((value) => (value !== 0 ? value + '0'.repeat(priceFrDigits) : value))
          .join(';');
      }),
    [priceFrDigits]
  );

  const {
    state: priceFilterState,
    nextUrlValue: priceFilterNextURLValue,
    handleChange: handlePriceFilterChange,
  } = useSynchronizedValue({
    params,
    defaultState: priceFilterDefaultState,
    urlParamName: PRICE_FILTER_NAME,
    onChangeFn: defaultRangeOnChangeFn,
    convertToStateFn: rangeConvertToStateFn,
    convertToParamFn: rangeConvertToParamFn,
  });

  const checkboxesDefaultState = useMemo(() => {
    const transformToState = (data: Set<string>) =>
      [...data].reduce((result, value) => {
        result[value] = false;
        return result;
      }, {} as TCheckboxState);

    return {
      defaultColorFilterState: transformToState(colorsData),
      defaultSizeFilterState: transformToState(sizesData),
    };
  }, [colorsData, sizesData]);

  const {
    state: stockFilterState,
    nextUrlValue: stockFilterNextURLValue,
    handleChange: handleStockFilterChange,
  } = useSynchronizedValue({
    params,
    defaultState: defaultStockFilterState,
    urlParamName: STOCK_FILTER_NAME,
    onChangeFn: defaultCheckboxUpdateStateFn,
    convertToStateFn: defaultCheckboxConvertToStateFn,
    convertToParamFn: defaultCheckboxConvertToParamFn,
  });

  const {
    state: colorFilterState,
    nextUrlValue: colorFilterNextURLValue,
    handleChange: handleColorFilterChange,
  } = useSynchronizedValue({
    params,
    defaultState: checkboxesDefaultState.defaultColorFilterState,
    urlParamName: COLOR_FILTER_NAME,
    onChangeFn: defaultCheckboxUpdateStateFn,
    convertToStateFn: defaultCheckboxConvertToStateFn,
    convertToParamFn: defaultCheckboxConvertToParamFn,
  });

  const {
    state: sizeFilterState,
    nextUrlValue: sizeFilterNextURLValue,
    handleChange: handleSizeFilterChange,
  } = useSynchronizedValue({
    params,
    defaultState: checkboxesDefaultState.defaultSizeFilterState,
    urlParamName: SIZE_FILTER_NAME,
    onChangeFn: defaultCheckboxUpdateStateFn,
    convertToStateFn: defaultCheckboxConvertToStateFn,
    convertToParamFn: defaultCheckboxConvertToParamFn,
  });

  const handleApplyBtnClick = useCallback(() => {
    const filters = [
      [STOCK_FILTER_NAME, stockFilterNextURLValue],
      [COLOR_FILTER_NAME, colorFilterNextURLValue],
      [SIZE_FILTER_NAME, sizeFilterNextURLValue],
      [PRICE_FILTER_NAME, priceFilterNextURLValue],
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
  }, [
    setParams,
    stockFilterNextURLValue,
    colorFilterNextURLValue,
    sizeFilterNextURLValue,
    priceFilterNextURLValue,
  ]);

  let dynamicFilters;

  if (areProjectionsFetching) {
    dynamicFilters = <LoaderBlock />;
  } else if (isProjectionsError) {
    dynamicFilters = <ErrorBlock />;
  } else {
    dynamicFilters = (
      <>
        {!!Object.keys(checkboxesDefaultState.defaultColorFilterState).length && (
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
        {!!Object.keys(checkboxesDefaultState.defaultSizeFilterState).length && (
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
    const filterKeys = [STOCK_FILTER_NAME, COLOR_FILTER_NAME, SIZE_FILTER_NAME, PRICE_FILTER_NAME];
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
      <div className={PRODUCT_FILTER_WRAP}>
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
        <div className={PRODUCT_FILTER_BLOCK}>
          <h4 className={classNames(H4, PRODUCT_FILTER_BLOCK_TITLE)}>
            {localizedAppStrings[locale][AppStrings.Price]}
          </h4>
          <div>
            <IntervalSlider
              minValueInputName={MIN_VALUE_CONTROL_NAME}
              maxValueInputName={MAX_VALUE_CONTROL_NAME}
              minValueControlName={MIN_VALUE_CONTROL_NAME}
              maxValueControlName={MAX_VALUE_CONTROL_NAME}
              state={priceFilterState}
              onStateChange={handlePriceFilterChange}
            />
          </div>
        </div>
        {dynamicFilters}
        <div className={PRODUCT_FILTER_BUTTONS}>
          <Button
            type="button"
            el="button"
            theme="primary"
            view="primary"
            size="sm"
            onClick={handleResetBtnClick}
            className={PRODUCT_FILTER_BUTTON}>
            {localizedAppStrings[locale][AppStrings.Reset]}
          </Button>
          <Button
            type="button"
            el="button"
            theme="primary"
            view="primary"
            size="sm"
            onClick={handleApplyBtnClick}
            className={PRODUCT_FILTER_BUTTON}>
            {localizedAppStrings[locale][AppStrings.Apply]}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductFilter;
