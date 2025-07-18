import { ChangeEvent, FC, memo, useEffect, useRef } from 'react';
import { TIntrinsicDiv } from '../../../types/types';
import classNames from 'classnames';
import './RangeSlider.scss';

export const MIN_CONTROL_NAME_PREFIX = 'min-';
export const MAX_CONTROL_NAME_PREFIX = 'max-';

export type TRangeState = {
  minValue: number;
  maxValue: number;
  values: number[];
};

export type TRangeSliderProps = {
  minValueControlName: `${typeof MIN_CONTROL_NAME_PREFIX}${string}`;
  maxValueControlName: `${typeof MAX_CONTROL_NAME_PREFIX}${string}`;
  state: TRangeState;
  onStateChange: (e: ChangeEvent<HTMLInputElement>) => void;
} & TIntrinsicDiv;

export const RANGE_SLIDER = 'range-slider';
export const RANGE_SLIDER_RAIL = `${RANGE_SLIDER}__rail`;
export const RANGE_SLIDER_INNER_WRAP = `${RANGE_SLIDER}__inner-wrap`;
export const RANGE_SLIDER_CONTROL = `${RANGE_SLIDER}__control`;
export const RANGE_SLIDER_INNER_RAIL = `${RANGE_SLIDER}__inner-rail`;
export const RANGE_SLIDER_THUMB = `${RANGE_SLIDER}__thumb`;
export const RANGE_SLIDER_THUMB_FOCUSED = `${RANGE_SLIDER}__thumb_focused`;

const RangeSlider: FC<TRangeSliderProps> = (props) => {
  const { state, onStateChange, minValueControlName, maxValueControlName, className, ...rest } =
    props;
  const {
    minValue,
    maxValue,
    values: [currentMinValue, currentMaxValue],
  } = state;

  const classes = classNames(RANGE_SLIDER, className);
  const minValueControlRef = useRef<HTMLInputElement>(null);
  const maxValueControlRef = useRef<HTMLInputElement>(null);
  const minValueControlThumbRef = useRef<HTMLDivElement>(null);
  const maxValueControlThumbRef = useRef<HTMLDivElement>(null);

  const minPos = ((currentMinValue - minValue) / (maxValue - minValue)) * 100;
  const maxPos = ((currentMaxValue - minValue) / (maxValue - minValue)) * 100;

  useEffect(() => {
    const minValueControl = minValueControlRef.current;
    const maxValueControl = maxValueControlRef.current;

    const isMinValueControl = (e: FocusEvent) => {
      return (e.target as HTMLInputElement).name.startsWith(MIN_CONTROL_NAME_PREFIX);
    };

    const handleControlFocus = (e: FocusEvent) => {
      if (isMinValueControl(e)) {
        minValueControlThumbRef.current?.classList.add(RANGE_SLIDER_THUMB_FOCUSED);
      } else {
        maxValueControlThumbRef.current?.classList.add(RANGE_SLIDER_THUMB_FOCUSED);
      }
    };

    const handleControlBlur = (e: FocusEvent) => {
      if (isMinValueControl(e)) {
        minValueControlThumbRef.current?.classList.remove(RANGE_SLIDER_THUMB_FOCUSED);
      } else {
        maxValueControlThumbRef.current?.classList.remove(RANGE_SLIDER_THUMB_FOCUSED);
      }
    };

    minValueControl?.addEventListener('focus', handleControlFocus);
    minValueControl?.addEventListener('blur', handleControlBlur);
    maxValueControl?.addEventListener('focus', handleControlFocus);
    maxValueControl?.addEventListener('blur', handleControlBlur);

    return () => {
      minValueControl?.removeEventListener('focus', handleControlFocus);
      minValueControl?.removeEventListener('blur', handleControlBlur);
      maxValueControl?.removeEventListener('focus', handleControlFocus);
      maxValueControl?.removeEventListener('blur', handleControlBlur);
    };
  }, []);

  return (
    <div {...rest} className={classes}>
      <input
        name={minValueControlName}
        className={RANGE_SLIDER_CONTROL}
        type="range"
        value={currentMinValue}
        min={minValue}
        max={maxValue}
        onChange={onStateChange}
        ref={minValueControlRef}
      />
      <input
        name={maxValueControlName}
        className={RANGE_SLIDER_CONTROL}
        type="range"
        value={currentMaxValue}
        min={minValue}
        max={maxValue}
        onChange={onStateChange}
        ref={maxValueControlRef}
      />

      <div className={RANGE_SLIDER_RAIL}></div>
      <div className={RANGE_SLIDER_INNER_WRAP}>
        <div
          className={RANGE_SLIDER_INNER_RAIL}
          style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }}
        />
        <div
          className={RANGE_SLIDER_THUMB}
          style={{ left: `${minPos}%` }}
          ref={minValueControlThumbRef}
        />
        <div
          className={RANGE_SLIDER_THUMB}
          style={{ left: `${maxPos}%` }}
          ref={maxValueControlThumbRef}
        />
      </div>
    </div>
  );
};

export default memo(RangeSlider);
