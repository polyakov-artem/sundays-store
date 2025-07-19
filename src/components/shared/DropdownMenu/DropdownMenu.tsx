import { FC, memo, ReactNode, useMemo } from 'react';
import { TIntrinsicDiv } from '../../../types/types';
import { getClasses } from '../../../utils/getClasses';
import './DropdownMenu.scss';

export type TDropdownMenu = TIntrinsicDiv & {
  position?: 'right' | 'left';
  items?: ReactNode[];
};

export const DROPDOWN_MENU = 'dropdown-menu';
export const DROPDOWN_MENU_LIST = `${DROPDOWN_MENU}__list`;
export const DROPDOWN_MENU_ITEM = `${DROPDOWN_MENU}__item`;

const DropdownMenu: FC<TDropdownMenu> = (props) => {
  const { className, position, items, ...restProps } = props;
  const classes = getClasses(DROPDOWN_MENU, className, { position });

  const content = useMemo(
    () =>
      items?.map((item, index) => (
        <li className={DROPDOWN_MENU_ITEM} key={index}>
          {item}
        </li>
      )),
    [items]
  );

  return (
    <div className={classes} {...restProps}>
      <ul className={DROPDOWN_MENU_LIST}>{content}</ul>
    </div>
  );
};

export default memo(DropdownMenu);
