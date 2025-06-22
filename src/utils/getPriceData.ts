import { CurrencyChar, TDiscountedPrice, TPriceData, TTypedMoney } from '../types/types';

export const convertToNumber = (amount: number, fractionDigits: number) =>
  Number((amount / 10 ** fractionDigits).toFixed(fractionDigits));

export const getAmount = (value: TTypedMoney) => {
  const { centAmount, type } = value;
  return type === 'centPrecision' ? centAmount : value.preciseAmount;
};

export const getPriceData = (
  originalPriceData: TTypedMoney,
  discountData?: TDiscountedPrice
): TPriceData => {
  const { fractionDigits } = originalPriceData;
  const currencyChar = CurrencyChar[originalPriceData.currencyCode];
  const discountId = discountData?.discount.id;

  const originalAmount = getAmount(originalPriceData);
  const originalPrice = convertToNumber(originalAmount, fractionDigits);

  const discountedAmount = discountData ? getAmount(discountData?.value) : originalAmount;
  const isDiscounted = discountedAmount !== originalAmount;

  const discountedPrice = isDiscounted
    ? convertToNumber(discountedAmount, fractionDigits)
    : originalPrice;

  const amountDifference = isDiscounted ? discountedAmount - originalAmount : 0;
  const priceDifference = isDiscounted ? convertToNumber(amountDifference, fractionDigits) : 0;

  const currentPrice = discountedPrice ? discountedPrice : originalPrice;
  const currentAmount = discountedAmount ? discountedAmount : originalAmount;

  return {
    fractionDigits,
    currencyChar,
    discountId,
    originalAmount,
    originalPrice,
    amountDifference,
    priceDifference,
    isDiscounted,
    currentPrice,
    currentAmount,
  };
};
