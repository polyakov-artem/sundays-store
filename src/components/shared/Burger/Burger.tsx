import { getClasses } from '../../../utils/getClasses';
import { TIntrinsicButton } from '../../../types/types';
import { FC, memo } from 'react';
import './Burger.scss';

export type TBurgerProps = {
  active?: boolean;
} & TIntrinsicButton;

export const BURGER = 'burger';
export const BURGER_ACTIVE = `${BURGER}_active`;
export const BURGER_ICON = 'burger-icon';

const Burger: FC<TBurgerProps> = (props) => {
  const { className, active, ...restProps } = props;
  const classes = getClasses(BURGER, className, { active });

  return (
    <button className={classes} {...restProps}>
      <span className={BURGER_ICON} />
    </button>
  );
};

export default memo(Burger);
