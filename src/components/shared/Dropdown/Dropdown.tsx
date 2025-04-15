import { useState, FC, ReactNode, useEffect, useRef } from 'react';
import { TIntrinsicDiv } from '../../../types/types';
import { getClasses } from '../../../utils/getClasses';
import './Dropdown.scss';

export type TDropdown = TIntrinsicDiv & {
  trigger?: ReactNode;
  menu?: ReactNode;
};

export const DROPDOWN = 'dropdown';
export const DROPDOWN_BTN_WRAP = `${DROPDOWN}__btn`;
export const DROPDOWN_CONTENT = `${DROPDOWN}__content`;

const Dropdown: FC<TDropdown> = (props) => {
  const { className, trigger, menu, ...restProps } = props;
  const [isOpen, setIsOpen] = useState(false);
  const classes = getClasses(DROPDOWN, className, { isOpen });
  const btnWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent | TouchEvent) => {
      if (btnWrapRef.current) {
        if (btnWrapRef.current.contains(event.target as Node)) {
          setIsOpen((prevState) => !prevState);
        } else {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className={classes} {...restProps}>
      <div className={DROPDOWN_BTN_WRAP} ref={btnWrapRef}>
        {trigger}
      </div>
      <div className={DROPDOWN_CONTENT}>{menu}</div>
    </div>
  );
};

export default Dropdown;
