import { CountryCode, CurrencyChar, TPrice, TTypedMoney } from '../types/types';

export const getPrice = (value?: TTypedMoney) => {
  if (value) {
    const { centAmount, fractionDigits } = value;
    const centAmountString = `${centAmount}`;
    const pointIndex = centAmountString.length - fractionDigits;

    return Number(centAmountString.slice(0, pointIndex) + '.' + centAmountString.slice(pointIndex));
  }
};

export const getLocalizedPriceData = (countryCode: CountryCode, prices?: TPrice[]) => {
  const priceData = prices?.find((price) => price.country === countryCode);
  if (!priceData) return;

  const {
    discounted,
    value: { fractionDigits, currencyCode, centAmount },
  } = priceData;

  const value = getPrice(priceData.value);
  const discountedValue = getPrice(discounted?.value);
  const discountDifference = discountedValue
    ? value
      ? Number((discountedValue - value).toFixed(2))
      : undefined
    : undefined;

  const currentValue = discountedValue ? discountedValue : value;

  return {
    currentValue,
    discountId: discounted?.discount.id,
    discountedValue,
    discountDifference,
    value,
    centAmount,
    currencyCode,
    fractionDigits,
    currencyChar: CurrencyChar[currencyCode],
  };
};
