import { CurrencyChar, TDiscountedPrice, TTypedMoney } from '../types/types';

export const getPrice = (value?: TTypedMoney) => {
  if (value) {
    const { centAmount, fractionDigits, type } = value;
    const amount = type === 'centPrecision' ? centAmount : value.preciseAmount;
    return Number((amount / 10 ** fractionDigits).toFixed(fractionDigits));
  }

  return 0;
};

export const getPriceData = (originalPriceData: TTypedMoney, discountData?: TDiscountedPrice) => {
  const fractionDigitsNumber = Math.max(
    originalPriceData.fractionDigits,
    discountData?.value.fractionDigits || 0
  );

  const isDiscounted = !!discountData;
  const discountPrice = getPrice(discountData?.value);
  const originalPrice = getPrice(originalPriceData);
  const currentPrice = isDiscounted ? discountPrice : originalPrice;
  const discountDifference = Number((originalPrice - discountPrice).toFixed(fractionDigitsNumber));
  const discountId = discountData?.discount.id;
  const currencyChar = CurrencyChar[originalPriceData.currencyCode];

  return {
    originalPrice,
    currentPrice,
    discountDifference,
    discountId,
    currencyChar,
    isDiscounted,
  };
};
