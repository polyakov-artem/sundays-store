import classNames from 'classnames';
import { FC, useCallback, Dispatch } from 'react';
import { TIntrinsicDiv } from '../../../types/types';
import Button from '../../shared/Button/Button';
import InputField from '../InputField/InputField';
import './Counter.scss';

export const COUNTER = 'counter';
export const COUNTER_BTN = `${COUNTER}__btn`;
export const COUNTER_INPUT = `${COUNTER}__input`;

export const MINUS_BTN_VALUE = 'minus';
export const PLUS_BTN_VALUE = 'plus';

export type TCountChangeHandler = (count: number) => void;

export type TCounterProps = {
  count: number;
  setCount: Dispatch<React.SetStateAction<number>>;
  max?: number;
  min?: number;
  disabled?: boolean;
} & TIntrinsicDiv;

const Counter: FC<TCounterProps> = (props) => {
  const { className, count, setCount, max, min, disabled, ...rest } = props;
  const classes = classNames(COUNTER, className);

  const handleBtnClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      const elementValue = e.currentTarget.value;

      if (elementValue === MINUS_BTN_VALUE) {
        setCount((prevCount) => {
          const nextValue = prevCount - 1;
          return min !== undefined ? Math.max(min, nextValue) : nextValue;
        });
      } else if (elementValue === PLUS_BTN_VALUE) {
        setCount((prevCount) => {
          const nextValue = prevCount + 1;
          return max !== undefined ? Math.min(max, nextValue) : nextValue;
        });
      }
    },
    [min, max, setCount]
  );

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setCount(() => {
        const parsedValue = parseInt(e.target.value);
        if (isNaN(parsedValue)) {
          return min !== undefined ? min : count;
        }

        if (max !== undefined && parsedValue > max) {
          return max;
        }

        if (min !== undefined && parsedValue < min) {
          return min;
        }

        return parsedValue;
      });
    },
    [max, min, count, setCount]
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
    </div>
  );
};

export default Counter;
