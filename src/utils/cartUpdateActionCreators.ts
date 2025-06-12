export const createAddLineItemAction = (productId: string, variantId: number, quantity: number) => {
  return {
    action: 'addLineItem' as const,
    productId,
    variantId,
    quantity,
  };
};

export const createRemoveLineItemAction = (lineItemId?: string, quantity?: number) => {
  return {
    action: 'removeLineItem' as const,
    lineItemId,
    quantity,
  };
};
