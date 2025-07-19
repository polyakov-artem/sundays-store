import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { TIntrinsicDiv } from '../../../types/types';
import { debounce } from '../../../utils/debounce';
import { getClasses } from '../../../utils/getClasses';
import './Collapse.scss';

export type TCollapse = {
  expanded?: boolean;
  duration?: number;
} & TIntrinsicDiv;

const COLLAPSE = 'collapse';
const COLLAPSE_CONTENT = `${COLLAPSE}__content`;

export const Collapse: FC<TCollapse> = (props) => {
  const { className, expanded, duration = 200, children } = props;
  const classes = getClasses(COLLAPSE, className, { expanded });

  const ref = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const setHeight = useCallback(() => {
    if (ref.current) {
      setContentHeight(ref.current.clientHeight);
    }
  }, []);

  useEffect(() => {
    setHeight();
  }, [children, setHeight]);

  useEffect(() => {
    const debouncedSetHeight = debounce(setHeight, 100);

    const handleWindowResize = () => {
      debouncedSetHeight();
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
      debouncedSetHeight.cancel();
    };
  }, [setHeight]);

  return (
    <div
      className={classes}
      style={{
        transitionDuration: `${duration}ms`,
        height: expanded ? contentHeight : 0,
      }}>
      <div ref={ref} className={COLLAPSE_CONTENT}>
        {children}
      </div>
    </div>
  );
};

export default memo(Collapse);
