import { FC, MouseEvent, useCallback } from 'react';
import { TIntrinsicHeader } from '../../../types/types';
import classNames from 'classnames';
import { BLOCK } from '../../../constants/cssHelpers';
import Button from '../../shared/Button/Button';
import { BsGrid3X2Gap, BsListTask } from 'react-icons/bs';
import { useSearchParams } from 'react-router';
import './ProductsHeader.scss';

export const PRODUCTS_HEADER = 'products-header';
export const PRODUCTS_HEADER_VIEW_MODS = `${PRODUCTS_HEADER}__view-mods`;
export const VIEW_MODE = 'view-mode';
export const VIEW_MODE_LIST = 'list';
export const VIEW_MODE_TILE = 'tile';
export type TProductsHeaderProps = TIntrinsicHeader;

const ProductsHeader: FC<TProductsHeaderProps> = (props) => {
  const { className, ...rest } = props;
  const classes = classNames(BLOCK, PRODUCTS_HEADER, className);
  const [searchParams, setSearchParams] = useSearchParams();
  const isListMode = searchParams.get(VIEW_MODE) === VIEW_MODE_LIST;

  const handleViewModeBtnClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      setSearchParams((params) => {
        params.set(VIEW_MODE, e.currentTarget.value);
        return params;
      });
    },
    [setSearchParams]
  );

  return (
    <header className={classes} {...rest}>
      <div className={PRODUCTS_HEADER_VIEW_MODS}>
        <Button
          selected={!isListMode}
          view="icon"
          theme="primary"
          el="button"
          value={VIEW_MODE_TILE}
          icon={<BsGrid3X2Gap />}
          onClick={handleViewModeBtnClick}
        />
        <Button
          selected={isListMode}
          view="icon"
          el="button"
          value={VIEW_MODE_LIST}
          theme="primary"
          icon={<BsListTask />}
          onClick={handleViewModeBtnClick}
        />
      </div>
    </header>
  );
};

export default ProductsHeader;
