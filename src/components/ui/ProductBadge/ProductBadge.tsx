import { FC } from 'react';
import { TIntrinsicP } from '../../../types/types';
import classNames from 'classnames';
import './ProductBadge.scss';

const PRODUCT_BADGE = 'product-badge';

export type TProductBadgeProps = {
  text?: string;
} & TIntrinsicP;

const ProductBadge: FC<TProductBadgeProps> = (props) => {
  const { className, text, ...rest } = props;

  const classes = classNames(PRODUCT_BADGE, className);

  return (
    <>
      {!!text && (
        <p className={classes} {...rest}>
          {text}
        </p>
      )}
    </>
  );
};

export default ProductBadge;
