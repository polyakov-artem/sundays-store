import { ElementType, memo, useMemo } from 'react';
import classNames from 'classnames';
import { TIntrinsicDiv, TObj } from '../../../types/types';
import { useField } from 'formik';
import { isObject } from '../../../utils/isObject';
import './ValidationField.scss';

export const VALIDATION_FIELD = 'validation-field';
export const VALIDATION_FIELD_MSG = `${VALIDATION_FIELD}__message`;
export const INVALID_FIELD_PROPS_PATH = 'Invalid "fieldPropsPath"';

export type TValidationFieldProps = TIntrinsicDiv & {
  componentProps: TObj;
  fieldPropsPath?: string[];
  hasValidation?: boolean;
  Component: ElementType;
};

const getFieldProps = (componentProps: TObj, fieldPropsPath: string[]) => {
  if (fieldPropsPath.length === 0) {
    return componentProps;
  }

  const innerProps = componentProps[fieldPropsPath[0]];
  if (!isObject(innerProps)) {
    throw new Error(INVALID_FIELD_PROPS_PATH);
  }

  return getFieldProps(innerProps, fieldPropsPath.slice(1));
};

function addNestedProps(props: TObj, additionalProps: TObj, nestedPropsPath: string[]) {
  let nestedPropsParent = props;

  if (!nestedPropsPath.length) {
    return { ...additionalProps, ...props };
  }

  for (let i = 0; i < nestedPropsPath.length - 1; i++) {
    const key = nestedPropsPath[i];
    if (!(key in nestedPropsParent) || !isObject(nestedPropsParent[key])) {
      nestedPropsParent[key] = {};
    }
    nestedPropsParent = nestedPropsParent[key] as TObj;
  }

  const nestedPropsKey = nestedPropsPath[nestedPropsPath.length - 1];
  const currentNestedProps = nestedPropsParent[nestedPropsKey];

  nestedPropsParent[nestedPropsKey] = isObject(currentNestedProps)
    ? { ...additionalProps, ...currentNestedProps }
    : additionalProps;

  return props;
}

const ValidationField = (props: TValidationFieldProps) => {
  const {
    className,
    Component,
    componentProps,
    fieldPropsPath = [],
    hasValidation = true,
    ...restProps
  } = props;
  const classes = classNames(VALIDATION_FIELD, className);

  const fieldProps = useMemo(
    () => getFieldProps(componentProps, fieldPropsPath),
    [componentProps, fieldPropsPath]
  );

  const [additionalFieldProps, meta] = useField(fieldProps);
  const errorMsg = (meta.touched && meta.error) || '';
  const invalid = !!errorMsg;

  const updatedComponentProps = useMemo(() => {
    return addNestedProps(
      { invalid, ...componentProps },
      additionalFieldProps as unknown as TObj,
      fieldPropsPath
    );
  }, [componentProps, fieldPropsPath, additionalFieldProps, invalid]);

  return (
    <div {...restProps} className={classes}>
      <Component {...updatedComponentProps} />
      {hasValidation && <p className={VALIDATION_FIELD_MSG}>{errorMsg}&nbsp;</p>}
    </div>
  );
};

export default memo(ValidationField);
