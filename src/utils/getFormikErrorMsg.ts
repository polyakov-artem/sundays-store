export type TStringDictionary = Record<string, string | undefined>;
export type TBooleanDictionary = Record<string, boolean>;
export type TFormikReturn = { errors: TStringDictionary; touched: TBooleanDictionary };
export const getFormikErrorMsg = (formik: TFormikReturn, key: string) =>
  formik.touched[key] && formik.errors[key] ? formik.errors[key] : '';
