import { createApi } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';
import {
  TAddLineItem,
  TCart,
  TCartDraft,
  TChangeMyCartParams,
  TCustomer,
  TCustomerSignInResult,
  TDeleteMyCartParams,
  TLineItem,
  TMyCartDraft,
  TMyCustomerChangePassword,
  TMyCustomerDraft,
  TMyCustomerSignin,
  TRemoveLineItem,
  TUpdateMyCartParams,
  TUpdateMyCustomerParams,
} from '../types/types';
import { TokenRole, authService } from '../services/authService';
import { axiosBaseQuery, TCustomError, TQueryResponse as TQueryResult } from './axiosBaseQuery';
import { isErrorWithCode } from '../utils/isErrorWithCode';
import { HttpStatusCode } from 'axios';
import { getCustomError } from '../utils/getCustomError';
import {
  anonymousTokenLoaded,
  authenticationEnded,
  authenticationStarted,
  cartUpdatingEnded,
  cartUpdatingStarted,
  endTokenLoading,
  startTokenLoading,
  userTokenLoaded,
} from './userSlice';
import {
  createAddLineItemAction,
  createRemoveLineItemAction,
} from '../utils/cartUpdateActionCreators';

export type TUserApi = typeof userApi;

const projectKey = import.meta.env.VITE_CTP_PROJECT_KEY;

export const createKeyForCartItemsMap = (productId: string, variantId: number) =>
  `${productId}_${variantId}`;

export const createCartItemsMap = (lineItems: TLineItem[]) =>
  lineItems.reduce(
    (result, lineItem) => {
      const {
        id: lineItemId,
        productId,
        variant: { id: variantId },
        quantity,
      } = lineItem;

      result[createKeyForCartItemsMap(productId, variantId)] = {
        quantity,
        lineItemId,
        productId,
        variantId,
      };
      return result;
    },
    {} as Record<
      string,
      {
        quantity: number;
        productId: string;
        variantId: number;
        lineItemId: string;
      }
    >
  );

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: axiosBaseQuery,
  tagTypes: ['Customer', 'Cart'],
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    getMe: builder.query<TCustomer | null, void>({
      queryFn: async (_data, { getState }, _extraOptions, fetchWithBQ) => {
        const { role } = (getState() as RootState).user;

        if (role !== TokenRole.user) {
          return { data: null };
        }

        const result = await fetchWithBQ({
          url: `${projectKey}/me`,
        });

        return result as TQueryResult<TCustomer>;
      },

      providesTags: ['Customer'],
    }),

    signIn: builder.mutation<TCustomerSignInResult, TMyCustomerSignin>({
      queryFn: async (data, { dispatch, getState }, _extraOptions, fetchWithBQ) => {
        dispatch(authenticationStarted());

        const signinResult = (await fetchWithBQ({
          url: `${projectKey}/me/login`,
          data,
          method: 'POST',
        })) as TQueryResult<TCustomerSignInResult>;

        if (signinResult.error) {
          dispatch(authenticationEnded());
          return signinResult;
        }

        try {
          const { token, refreshToken, role } = (getState() as RootState).user;
          await startTokenLoading();

          const tokenData = await authService.getUserTokenData(data);

          dispatch(
            userTokenLoaded({
              token: tokenData.access_token,
              refreshToken: tokenData.refresh_token,
            })
          );

          if (role === TokenRole.anonymous) {
            authService.revokeTokens(token, refreshToken);
          }

          return signinResult;
        } catch (e) {
          const error = getCustomError(e);
          return { error };
        } finally {
          endTokenLoading();
          dispatch(authenticationEnded());
        }
      },
      invalidatesTags: ['Customer', 'Cart'],
    }),

    signUp: builder.mutation<TCustomerSignInResult, TMyCustomerDraft>({
      queryFn: async (data, { dispatch }, _extraOptions, fetchWithBQ) => {
        dispatch(authenticationStarted());

        const result = (await fetchWithBQ({
          url: `${projectKey}/me/signup`,
          data,
          method: 'POST',
        })) as TQueryResult<TCustomerSignInResult>;

        dispatch(authenticationEnded());
        return result;
      },
    }),

    updateMyCustomer: builder.mutation<TCustomer, TUpdateMyCustomerParams>({
      query: (data: TUpdateMyCustomerParams) => ({
        url: `${projectKey}/me`,
        data,
        method: 'POST',
      }),
      invalidatesTags: ['Customer'],
    }),

    changePassword: builder.mutation<TCustomer, TMyCustomerChangePassword>({
      query: (data: TMyCustomerChangePassword) => ({
        url: `${projectKey}/me/password`,
        data,
        method: 'POST',
      }),
      invalidatesTags: ['Customer'],
    }),

    getMyActiveCart: builder.query<TCart | null, void>({
      queryFn: async (_data, { getState }, _extraOptions, fetchWithBQ) => {
        const { role } = (getState() as RootState).user;

        if (role === TokenRole.basic) {
          return { data: null };
        }

        const result = (await fetchWithBQ({
          url: `${projectKey}/me/active-cart`,
        })) as TQueryResult<TCart>;

        if (isErrorWithCode(HttpStatusCode.NotFound, result.error)) {
          return { data: null };
        }

        return result;
      },

      providesTags: ['Cart'],
    }),

    changeItemsQuantityInCart: builder.mutation<TCart, TChangeMyCartParams>({
      queryFn: async ({ cartDraft, changedQuantityItems }, { dispatch }) => {
        dispatch(cartUpdatingStarted());

        const { error: activeCartQueryError, data: activeCartQueryData } = await dispatch(
          userApi.endpoints.getOrCreateActiveCart.initiate(cartDraft)
        );

        if (activeCartQueryError) {
          const error = activeCartQueryError as TCustomError;
          dispatch(cartUpdatingEnded());
          return { error };
        }

        const activeCart: TCart = activeCartQueryData;

        const { lineItems, version, id: cartId } = activeCart;

        const cartItemsMap = createCartItemsMap(lineItems);

        const cartItemsToRemove = [];
        const addLineItemActions: TAddLineItem[] = [];
        const removeLineItemActions: TRemoveLineItem[] = [];

        changedQuantityItems.forEach(({ productId, variantId, nextQuantity }) => {
          const key = createKeyForCartItemsMap(productId, variantId);
          const cartItem = cartItemsMap[key];

          if (cartItem) {
            const quantityDiff = nextQuantity - cartItem.quantity;

            if (quantityDiff > 0) {
              addLineItemActions.push(createAddLineItemAction(productId, variantId, quantityDiff));
            } else if (quantityDiff < 0) {
              if (nextQuantity <= 0) {
                cartItemsToRemove.push(cartItem.lineItemId);
              }
              removeLineItemActions.push(
                createRemoveLineItemAction(cartItem.lineItemId, -quantityDiff)
              );
            }
            return;
          }

          if (nextQuantity <= 0) {
            return;
          }

          addLineItemActions.push(createAddLineItemAction(productId, variantId, nextQuantity));
        });

        if (cartItemsToRemove.length === lineItems.length && !addLineItemActions.length) {
          const { error: deleteCartQueryError, data: deleteCartQueryData } = await dispatch(
            userApi.endpoints.deleteMyCart.initiate({ cartId, params: { version } })
          );

          if (deleteCartQueryError) {
            const error = deleteCartQueryError as TCustomError;
            dispatch(cartUpdatingEnded());
            return { error };
          }

          const deletedCart: TCart = deleteCartQueryData;

          dispatch(cartUpdatingEnded());
          return { data: deletedCart };
        }

        const { error: updateCartQueryError, data: updateCartQueryData } = await dispatch(
          userApi.endpoints.updateMyCart.initiate({
            cartId,
            data: { version, actions: [...addLineItemActions, ...removeLineItemActions] },
          })
        );

        if (updateCartQueryError) {
          const error = updateCartQueryError as TCustomError;
          dispatch(cartUpdatingEnded());
          return { error };
        }

        const updatedCart: TCart = updateCartQueryData;

        dispatch(cartUpdatingEnded());
        return { data: updatedCart };
      },

      invalidatesTags: ['Cart'],
    }),

    getOrCreateActiveCart: builder.mutation<TCart, TCartDraft>({
      queryFn: async (cartDraft, { getState, dispatch }) => {
        const { role } = (getState() as RootState).user;

        if (role === TokenRole.basic) {
          try {
            await startTokenLoading();
            const tokenData = await authService.getAnonymousTokenData();

            dispatch(
              anonymousTokenLoaded({
                token: tokenData.access_token,
                refreshToken: tokenData.refresh_token,
              })
            );
          } catch (e) {
            const error = getCustomError(e);
            return { error };
          } finally {
            endTokenLoading();
          }
        }

        const getMyActiveCartQuerySubscription = dispatch(
          userApi.endpoints.getMyActiveCart.initiate()
        );

        const { data: activeCartQueryData, error: activeCartQueryError } =
          await getMyActiveCartQuerySubscription;

        getMyActiveCartQuerySubscription.unsubscribe();

        if (activeCartQueryError) {
          const error = activeCartQueryError as TCustomError;
          return { error };
        }

        if (activeCartQueryData) {
          const activeCart: TCart = activeCartQueryData;
          return { data: activeCart };
        }

        const { error: createCartQueryError, data: createCartQueryData } = await dispatch(
          userApi.endpoints.createMyCart.initiate(cartDraft)
        );

        if (createCartQueryError) {
          const error = createCartQueryError as TCustomError;
          return { error };
        }

        const activeCart: TCart = createCartQueryData;
        return { data: activeCart };
      },
    }),

    createMyCart: builder.mutation<TCart, TMyCartDraft>({
      query: (data: TCartDraft) => {
        return {
          url: `${projectKey}/me/carts`,
          data,
          method: 'POST',
        };
      },
    }),

    updateMyCart: builder.mutation<TCart, TUpdateMyCartParams>({
      query: ({ cartId, data }: TUpdateMyCartParams) => {
        return {
          url: `${projectKey}/me/carts/${cartId}`,
          data,
          method: 'POST',
        };
      },
    }),

    deleteMyCart: builder.mutation<TCart, TDeleteMyCartParams>({
      query: ({ cartId, params }: TDeleteMyCartParams) => {
        return {
          url: `${projectKey}/me/carts/${cartId}`,
          params,
          method: 'DELETE',
        };
      },
    }),
  }),
});

export const {
  useGetMeQuery,
  useLazyGetMeQuery,
  useSignUpMutation,
  useUpdateMyCustomerMutation,
  useChangePasswordMutation,
  useGetMyActiveCartQuery,
  useLazyGetMyActiveCartQuery,
  useUpdateMyCartMutation,
  useSignInMutation,
  useChangeItemsQuantityInCartMutation,
} = userApi;
