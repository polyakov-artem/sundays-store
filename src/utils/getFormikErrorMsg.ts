export type TStringDictionary = Record<string, string | undefined>;
export type TBooleanDictionary = Record<string, boolean>;
export type TFormikReturn = { errors: TStringDictionary; touched: TBooleanDictionary };

export const getFormikErrorMsg = (formik: TFormikReturn, key: string): string => {
  const errorMsg = formik.errors[key];
  if (formik.touched[key] && errorMsg) return errorMsg;
  return '';
};
