import { ChangeEvent, FC, useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import RangeSlider, {
  MIN_CONTROL_NAME_PREFIX,
  TRangeSliderProps,
} from '../RangeSlider/RangeSlider';
import InputField from '../InputField/InputField';
import './IntervalSlider.scss';

export type TIntervalSliderProps = {
  minValueInputName: TRangeSliderProps['minValueControlName'];
  maxValueInputName: TRangeSliderProps['maxValueControlName'];
} & TRangeSliderProps;

export const INTERVAL_SLIDER = 'interval-slider';
export const INTERVAL_SLIDER_SLIDER = `${INTERVAL_SLIDER}__slider`;
export const INTERVAL_SLIDER_WRAP = `${INTERVAL_SLIDER}__wrap`;
export const INTERVAL_SLIDER_INPUT = `${INTERVAL_SLIDER}__input`;

const IntervalSlider: FC<TIntervalSliderProps> = (props) => {
  const {
    state,
    minValueControlName,
    maxValueControlName,
    className,
    minValueInputName,
    maxValueInputName,
    onStateChange,
    ...rest
  } = props;
  const { minValue, maxValue, values } = state;
  const classes = classNames(INTERVAL_SLIDER, className);
  const [fieldsState, setFieldsState] = useState(values);

  const handleInputFieldChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    const nextValue = Number(value);

    if (!isFinite(nextValue)) {
      return;
    }

    setFieldsState((prevState) =>
      name.startsWith(MIN_CONTROL_NAME_PREFIX)
        ? [nextValue, prevState[1]]
        : [prevState[0], nextValue]
    );
  }, []);

  useEffect(() => {
    setFieldsState(values);
  }, [values, minValueInputName, maxValueInputName]);

  return (
    <div {...rest} className={classes}>
      <RangeSlider
        state={state}
        onStateChange={onStateChange}
        minValueControlName={minValueControlName}
        maxValueControlName={maxValueControlName}
        className={INTERVAL_SLIDER_SLIDER}
      />
      <div className={INTERVAL_SLIDER_WRAP}>
        <InputField
          name={minValueInputName}
          className={INTERVAL_SLIDER_INPUT}
          value={fieldsState[0]}
          type="number"
          theme="primary"
          view="primary"
          onChange={handleInputFieldChange}
          onBlur={onStateChange}
          min={minValue}
          max={maxValue}
        />
        <InputField
          name={maxValueInputName}
          className={INTERVAL_SLIDER_INPUT}
          value={fieldsState[1]}
          type="number"
          theme="primary"
          view="primary"
          min={minValue}
          max={maxValue}
          onChange={handleInputFieldChange}
          onBlur={onStateChange}
        />
        <input type="submit" value="" style={{ display: 'none' }} />
      </div>
    </div>
  );
};

export default IntervalSlider;
