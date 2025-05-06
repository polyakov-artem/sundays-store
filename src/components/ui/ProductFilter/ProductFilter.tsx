import { FC, FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import './ProductFilter.scss';
import { localizedAppStrings } from '../../../constants/localizedAppStrings';
import { AppStrings } from '../../../constants/appStrings';

export const PRODUCT_FILTER = 'product-filter';
export const PRODUCT_FILTER_FORM = `${PRODUCT_FILTER}__form`;
export const PRODUCT_FILTER_BLOCK = `${PRODUCT_FILTER}__block`;
export const PRODUCT_FILTER_BLOCK_TITLE = `${PRODUCT_FILTER}__block-title`;

export const STOCK_FILTER_NAME = 'stock';
export const STOCK_FILTER_VALUE = 'true';
export const COLOR_FILTER_NAME = 'color';

export type TProductFilterProps = TIntrinsicDiv;

export interface CustomElements extends HTMLFormControlsCollection {
  [STOCK_FILTER_NAME]: HTMLInputElement;
  [COLOR_FILTER_NAME]?: HTMLInputElement | NodeListOf<HTMLInputElement>;
}

export interface CustomForm extends HTMLFormElement {
  readonly elements: CustomElements;
}

const ProductFilter: FC<TProductFilterProps> = (props) => {
  const { className, ...rest } = props;
  const classes = classNames(BLOCK, PRODUCT_FILTER, className);
  const locale = useAppSelector(selectLocale);
  const [params, setParams] = useSearchParams();
  const formRef = useRef<HTMLFormElement>(null);
  const { id: categoryId } = useParams();
  const stockFilterParamValue = params.get(STOCK_FILTER_NAME);
  const colorFilterParamValue = params.get(COLOR_FILTER_NAME);
  const [isStockFilterChecked, setIsStockFilterChecked] = useState(false);
  const [checkedColors, setCheckedColors] = useState<Record<string, boolean>>({});

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

  const attributes = useMemo(() => {
    const colorsData = new Set<string>();

    projectionsData?.results.forEach(({ masterVariant, variants }) => {
      [masterVariant, ...variants].forEach(({ attributes }) => {
        attributes?.forEach(({ name, value }) => {
          if (name === COLOR_FILTER_NAME && value[locale]) {
            colorsData.add(value[locale]);
          }
        });
      });
    });

    return { colorsData };
  }, [locale, projectionsData]);

  const { colorsData } = attributes;

  useEffect(() => {
    const result: Record<string, boolean> = {};
    colorFilterParamValue
      ?.replaceAll('"', '')
      .split(',')
      .forEach((paramValue) => {
        if (colorsData.has(paramValue)) {
          result[paramValue] = true;
        }
      });

    setCheckedColors(result);
  }, [colorFilterParamValue, colorsData]);

  useEffect(() => {
    setIsStockFilterChecked(!!stockFilterParamValue);
  }, [stockFilterParamValue]);

  const handleSubmit = useCallback(
    (e: FormEvent<CustomForm>) => {
      e.preventDefault();

      const colorFilterValue = Object.keys(checkedColors).reduce((result, checkboxValue) => {
        if (!result) {
          return `"${checkboxValue}"`;
        } else {
          return `${result},"${checkboxValue}"`;
        }
      }, '');

      const stockFilterParamValueDiffers = !!stockFilterParamValue !== isStockFilterChecked;
      const colorFilterParamValueDiffers = (colorFilterParamValue || '') !== colorFilterValue;

      if (colorFilterParamValueDiffers || stockFilterParamValueDiffers) {
        setParams((prev) => {
          if (isStockFilterChecked) {
            prev.set(STOCK_FILTER_NAME, STOCK_FILTER_VALUE);
          } else {
            prev.delete(STOCK_FILTER_NAME);
          }

          if (colorFilterValue) {
            prev.set(COLOR_FILTER_NAME, colorFilterValue);
          } else {
            prev.delete(COLOR_FILTER_NAME);
          }

          return prev;
        });
      }
    },
    [setParams, isStockFilterChecked, checkedColors, colorFilterParamValue, stockFilterParamValue]
  );

  const handleColorChange = useCallback((key: string) => {
    setCheckedColors((prev) => {
      const nextState = { ...prev };
      if (nextState[key]) {
        delete nextState[key];
      } else {
        nextState[key] = true;
      }
      return nextState;
    });
  }, []);

  let dynamicFilters;

  if (areProjectionsFetching) {
    dynamicFilters = <LoaderBlock />;
  } else if (isProjectionsError) {
    dynamicFilters = <ErrorBlock />;
  } else {
    dynamicFilters = (
      <>
        {!!colorsData.size && (
          <div className={PRODUCT_FILTER_BLOCK}>
            <h4 className={classNames(H4, PRODUCT_FILTER_BLOCK_TITLE)}>
              {localizedAppStrings[locale][AppStrings.Colors]}
            </h4>
            <ColorPalette
              colorsData={colorsData}
              checkedColors={checkedColors}
              name={COLOR_FILTER_NAME}
              onColorChange={handleColorChange}
            />
          </div>
        )}
      </>
    );
  }

  const handleStockFilterChange = useCallback(() => {
    setIsStockFilterChecked((prev) => !prev);
  }, []);

  const handleResetBtnClick = useCallback(() => {
    if (colorFilterParamValue || stockFilterParamValue) {
      setParams((prev) => {
        prev.delete(STOCK_FILTER_NAME);
        prev.delete(COLOR_FILTER_NAME);
        return prev;
      });
    }
  }, [setParams, colorFilterParamValue, stockFilterParamValue]);

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
                checked: isStockFilterChecked,
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
