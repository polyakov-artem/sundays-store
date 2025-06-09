import classNames from 'classnames';
import { FC, useCallback } from 'react';
import { TIntrinsicDiv } from '../../../types/types';
import Button from '../../shared/Button/Button';
import InputField from '../InputField/InputField';
import ScreenLoader from '../ScreenLoader/ScreenLoader';
import './Counter.scss';

export const COUNTER = 'counter';
export const COUNTER_BTN = `${COUNTER}__btn`;
export const COUNTER_INPUT = `${COUNTER}__input`;
export const COUNTER_SPINNER = `${COUNTER}__spinner`;

export const MINUS_BTN_VALUE = 'minus';
export const PLUS_BTN_VALUE = 'plus';

export type TCountChangeHandler = (count: number) => void;

export type TCounterProps = {
  count: number;
  max?: number;
  min?: number;
  disabled?: boolean;
  isLoading?: boolean;
  step?: number;
  onCountChange: (count: number) => void | Promise<void>;
} & TIntrinsicDiv;

const getNewCount = (nextValue: number, min?: number, max?: number) => {
  if (min !== undefined && nextValue < min) {
    return min;
  }

  if (max !== undefined && nextValue > max) {
    return max;
  }

  return nextValue;
};

const handleIncrement = (count: number, step: number, max?: number): number => {
  const nextValue = count + step;
  return getNewCount(nextValue, undefined, max);
};

const handleDecrement = (count: number, step: number, min?: number): number => {
  const nextValue = count - step;
  return getNewCount(nextValue, min, undefined);
};

const Counter: FC<TCounterProps> = (props) => {
  const {
    className,
    count,
    onCountChange,
    max,
    min,
    disabled,
    isLoading,
    step = 1,
    ...rest
  } = props;
  const classes = classNames(COUNTER, className);

  const handleBtnClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) {
        return;
      }

      const newCount =
        e.currentTarget.value === MINUS_BTN_VALUE
          ? handleDecrement(count, step, min)
          : handleIncrement(count, step, max);

      if (newCount !== count) {
        void onCountChange(newCount);
      }
    },
    [disabled, onCountChange, min, max, count, step]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (disabled) {
        return;
      }

      const parsedValue = parseInt(e.target.value);

      if (isNaN(parsedValue)) {
        const newCount = min !== undefined ? min : count;

        if (newCount !== count) {
          void onCountChange(newCount);
        }

        return;
      }

      const newCount = getNewCount(parsedValue, min, max);

      if (newCount !== count) {
        void onCountChange(newCount);
      }
    },
    [disabled, onCountChange, min, max, count]
  );

  return (
    <div {...rest} className={classes}>
      <Button
        view="round"
        theme="secondary"
        el="button"
        size="sm"
        type="button"
        className={COUNTER_BTN}
        onClick={handleBtnClick}
        icon={'-'}
        value={MINUS_BTN_VALUE}
        disabled={disabled || min === count}
      />
      <InputField
        theme="primary"
        view="primary"
        scale="sm"
        className={COUNTER_INPUT}
        value={count}
        inputMode="numeric"
        onChange={handleInputChange}
        disabled={disabled}
      />
      <Button
        view="round"
        theme="secondary"
        el="button"
        size="sm"
        type="button"
        className={COUNTER_BTN}
        onClick={handleBtnClick}
        icon={'+'}
        value={PLUS_BTN_VALUE}
        disabled={disabled || max === count}
      />
      {isLoading && <ScreenLoader type="round" theme="green" className={COUNTER_SPINNER} />}
    </div>
  );
};

export default Counter;
