import { FC } from 'react';
import { TIntrinsicFieldset } from '../../../types/types';
import classNames from 'classnames';
import './Fieldset.scss';

export const FIELDSET = 'fieldset';
export const FIELDSET_TITLE = `${FIELDSET}__title`;

export type TFieldsetProps = TIntrinsicFieldset & {
  title?: string;
};

const Fieldset: FC<TFieldsetProps> = (props) => {
  const { className, children, title, ...restProps } = props;
  const classes = classNames(FIELDSET, className);

  return (
    <fieldset className={classes} {...restProps} data-testid="fieldset">
      {!!title && <legend className={FIELDSET_TITLE}>{title}</legend>}
      {children}
    </fieldset>
  );
};

export default Fieldset;
