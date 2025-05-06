import { FC, useMemo } from 'react';
import { TIntrinsicDiv } from '../../../types/types';
import classNames from 'classnames';
import CheckboxField from '../../shared/CheckboxField/CheckboxField';
import './CheckboxList.scss';

export const CHECKBOX_LIST = 'checkbox-list';
export const CHECKBOX_LIST_ITEM = `${CHECKBOX_LIST}_item`;

export type TCheckboxListProps = {
  name: string;
  checkboxesData: Set<string>;
  selectedCheckbox: Record<string, boolean>;
  onCheckboxChange: (key: string) => void;
} & TIntrinsicDiv;

const CheckboxList: FC<TCheckboxListProps> = (props) => {
  const { className, checkboxesData, selectedCheckbox, onCheckboxChange, name } = props;
  const classes = classNames(CHECKBOX_LIST, className);

  const content = useMemo(() => {
    return [...checkboxesData].map((value) => {
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
              checked: !!selectedCheckbox[value],
              onChange: () => onCheckboxChange(value),
            },
          }}
        />
      );
    });
  }, [checkboxesData, selectedCheckbox, onCheckboxChange, name]);

  return <div className={classes}>{content}</div>;
};

export default CheckboxList;
