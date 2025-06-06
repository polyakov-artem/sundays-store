import { useCallback, useMemo, useState } from 'react';
import {
  CountryLocale,
  Order,
  TLocalizedString,
  TExtProductVariant,
  TProductDiscount,
} from '../types/types';
import { createNormalizedData } from '../utils/createNormalizedData';
import { EntityState } from '@reduxjs/toolkit';

export type TUseProductVariantProps = {
  variants: TExtProductVariant[];
  name?: TLocalizedString;
  description?: TLocalizedString;
  priceSorting?: Order;
  paramVariantId?: number | null;
  locale: CountryLocale;
  discounts: EntityState<TProductDiscount, string>;
};

export const useProductVariant = ({
  variants,
  name,
  description,
  priceSorting,
  paramVariantId,
  discounts,
  locale,
}: TUseProductVariantProps) => {
  const variantsData = useMemo(() => createNormalizedData(variants, 'id'), [variants]);
  const { ids: variantIds, entities: variantEntities } = variantsData;

  const defaultInnerVariantId = useMemo(() => {
    let defaultId = variantIds[0];

    if (priceSorting) {
      variantIds.forEach((id) => {
        const currentValue = variantEntities[defaultId].scopedPrice.currentValue.centAmount;
        const variantValue = variantEntities[id].scopedPrice.currentValue.centAmount;

        if (
          (priceSorting === Order.asc && currentValue > variantValue) ||
          (priceSorting === Order.desc && currentValue < variantValue)
        ) {
          defaultId = id;
        }
      });
    }

    return defaultId;
  }, [variantIds, variantEntities, priceSorting]);

  const [innerVariantId, setInnerVariantId] = useState(defaultInnerVariantId);
  const currentVariantId =
    !!paramVariantId && !!variantEntities[paramVariantId] ? paramVariantId : innerVariantId;

  const currentVariant = variantEntities[currentVariantId];

  const { images, availability, priceData } = currentVariant;
  const isAvailable = availability?.isOnStock;
  const localizedName = name?.[locale] || '';
  const localizedDescription = description?.[locale] || '';

  const {
    currentPrice,
    discountDifference,
    discountId,
    currencyChar,
    isDiscounted,
    originalPrice,
  } = priceData;

  const discountName = discountId ? discounts.entities[discountId]?.name[locale] : '';

  const handleVariantIdSetting = useCallback((id: number) => {
    setInnerVariantId(id);
  }, []);

  return {
    images,
    isAvailable,
    localizedName,
    localizedDescription,
    currentPrice,
    discountDifference,
    currencyChar,
    isDiscounted,
    originalPrice,
    discountName,
    currentVariantId,
    handleVariantIdSetting,
  };
};
