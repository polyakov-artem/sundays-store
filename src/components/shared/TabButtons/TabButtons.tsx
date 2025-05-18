import { useMemo } from 'react';
import { TIntrinsicDiv } from '../../../types/types';
import { getClasses } from '../../../utils/getClasses';
import Button from '../Button/Button';
import './TabButtons.scss';

export type TTabButtonsProps<T, K extends keyof T> = {
  items: T[];
  nameProp: keyof T;
  valueProp: K;
  selectedValue: T[K];
  onTabBtnClick: (value: T[K]) => void;
} & TIntrinsicDiv;

export const TAB_BUTTONS = 'tab-buttons';

const TabButtons = <T, K extends keyof T>(props: TTabButtonsProps<T, K>) => {
  const { className, nameProp, items, selectedValue, valueProp, onTabBtnClick, ...restProps } =
    props;
  const classes = getClasses(TAB_BUTTONS, className);

  const buttons = useMemo(() => {
    return items.map((item) => {
      const name = '' + item[nameProp];
      const value = item[valueProp];
      const key = JSON.stringify(value);

      return (
        <Button
          key={key}
          el="button"
          theme="primary"
          view="tab"
          size="sm"
          selected={value === selectedValue}
          onClick={() => onTabBtnClick(value)}>
          {name}
        </Button>
      );
    });
  }, [items, nameProp, onTabBtnClick, selectedValue, valueProp]);

  return (
    <div className={classes} {...restProps}>
      {buttons}
    </div>
  );
};

export default TabButtons;
