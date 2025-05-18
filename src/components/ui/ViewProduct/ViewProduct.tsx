import { FC } from 'react';
import {
  selectGetProductDiscountsAdapterState,
  useGetProductDiscountsQuery,
  useGetProductProjectionByIdQuery,
} from '../../../store/storeApi';
import { useParams } from 'react-router';
import Breadcrumbs from '../../shared/Breadcrumbs/Breadcrumbs';
import { useAppSelector } from '../../../hooks/store-hooks';
import { selectCountryCode } from '../../../store/settingsSlice';
import { WRAPPER } from '../../../constants/cssHelpers';
import { useCrumbs } from '../../../hooks/useCrumbs';
import ErrorBlock from '../ErrorBlock/ErrorBlock';
import LoaderBlock from '../LoaderBlock/LoaderBlock';
import { CountryCurrency } from '../../../types/types';
import Product from '../Product/Product';
import './ViewProduct.scss';

export const VIEW_PRODUCT = 'view-product';
export const VIEW_PRODUCT_BREADCRUMBS = `${VIEW_PRODUCT}__breadcrumbs`;

const ViewProduct: FC = () => {
  const { productId = '' } = useParams();
  const countryCode = useAppSelector(selectCountryCode);

  const { isFetching: areDiscountsFetching } = useGetProductDiscountsQuery();
  const discounts = useAppSelector(selectGetProductDiscountsAdapterState);

  const {
    isFetching: isProductFetching,
    isError: isProductError,
    data: productProjection,
  } = useGetProductProjectionByIdQuery({
    id: productId,
    params: {
      priceCurrency: CountryCurrency[countryCode],
      priceCountry: countryCode,
    },
  });

  const crumbs = useCrumbs();

  let content;

  if (isProductFetching || areDiscountsFetching) {
    content = <LoaderBlock />;
  } else if (isProductError) {
    content = <ErrorBlock isBlock />;
  } else if (productProjection) {
    content = <Product productProjection={productProjection} discounts={discounts} />;
  }

  return (
    <main className={VIEW_PRODUCT}>
      <div className={WRAPPER}>
        <Breadcrumbs crumbs={crumbs} className={VIEW_PRODUCT_BREADCRUMBS} />
        {content}
      </div>
    </main>
  );
};

export default ViewProduct;
