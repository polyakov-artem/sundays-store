import { ChangeEvent, FC, useMemo } from 'react';
import { TIntrinsicDiv } from '../../../types/types';
import classNames from 'classnames';
import CheckboxField from '../../shared/CheckboxField/CheckboxField';
import { TCheckboxState } from '../../../utils/useSynchronizedValueFns';
import './CheckboxList.scss';

export const CHECKBOX_LIST = 'checkbox-list';
export const CHECKBOX_LIST_ITEM = `${CHECKBOX_LIST}__item`;

export type TCheckboxListProps = {
  name: string;
  state: TCheckboxState;
  onStateChange: (e: ChangeEvent<HTMLInputElement>) => void;
} & TIntrinsicDiv;

const CheckboxList: FC<TCheckboxListProps> = (props) => {
  const { className, state, onStateChange, name } = props;
  const classes = classNames(CHECKBOX_LIST, className);

  const content = useMemo(() => {
    return Object.entries(state).map(([value, checked]) => {
      return (
        <CheckboxField
          className={CHECKBOX_LIST_ITEM}
          key={value}
          labelContent={value}
          checkboxProps={{
            theme: 'primary',
            view: 'primary',
            controlProps: {
              id: value,
              name,
              value,
              checked,
              onChange: onStateChange,
            },
          }}
        />
      );
    });
  }, [state, onStateChange, name]);

  return <div className={classes}>{content}</div>;
};

export default CheckboxList;
