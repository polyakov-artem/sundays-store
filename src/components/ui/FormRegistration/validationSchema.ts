import * as Yup from 'yup';
import { inputErrors, regexps } from '../../../constants/constants';
import {
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_SPECIAL_CHARS,
} from '../FormLogin/FormLogin';
import { SELECT_OPTIONS } from './selectOptions';

export const MIN_AGE = 13;

export const emailValidator = Yup.string()
  .matches(regexps.onlyNonWhitespaces, inputErrors.whitespaces)
  .matches(regexps.containsEmailSeparator, inputErrors.emailSeparator)
  .matches(regexps.containsDomainName, inputErrors.domainName)
  .email(inputErrors.email)
  .required(inputErrors.required);

export const passwordValidator = Yup.string()
  .min(PASSWORD_MIN_LENGTH, inputErrors.length(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH))
  .max(PASSWORD_MAX_LENGTH, inputErrors.length(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH))
  .matches(regexps.onlyNonWhitespaces, inputErrors.whitespaces)
  .matches(regexps.containsUppercaseLetter, inputErrors.uppercaseLetter)
  .matches(regexps.containsLowercaseLetter, inputErrors.lowercaseLetter)
  .matches(regexps.containsDigit, inputErrors.digit)
  .matches(new RegExp(`[${PASSWORD_SPECIAL_CHARS}]`), inputErrors.oneOf(PASSWORD_SPECIAL_CHARS))
  .required(inputErrors.required);

export const validationSchema = Yup.object().shape({
  email: emailValidator,
  password: passwordValidator,
  firstName: Yup.string()
    .matches(regexps.charsWithoutNumbersAndSpecials, inputErrors.charsWithoutNumbersAndSpecials)
    .required(inputErrors.required),
  lastName: Yup.string()
    .matches(regexps.charsWithoutNumbersAndSpecials, inputErrors.charsWithoutNumbersAndSpecials)
    .required(inputErrors.required),
  dateOfBirth: Yup.string()
    .matches(regexps.dateYYYYMMDDFormat, inputErrors.date)
    .test('dates-test', inputErrors.age(MIN_AGE), (value: string | undefined) => {
      if (!value) return false;
      const dates = value.split('-');

      if (dates.length !== 3) return false;
      let dateOfBirth: Date;

      try {
        dateOfBirth = new Date(parseInt(dates[0]), parseInt(dates[1]) - 1, parseInt(dates[2]));
      } catch {
        return false;
      }

      if (Date.now() - dateOfBirth.getTime() < new Date(1970 + MIN_AGE, 0).getTime()) {
        return false;
      }

      return true;
    })

    .required(inputErrors.required),
  streetName: Yup.string()
    .matches(regexps.containsChar, inputErrors.chars)
    .required(inputErrors.required),
  city: Yup.string()
    .matches(regexps.charsWithoutNumbersAndSpecials, inputErrors.charsWithoutNumbersAndSpecials)
    .required(inputErrors.required),
  postalCode: Yup.string()
    .matches(regexps.postalCode, inputErrors.postalCode)
    .required(inputErrors.required),
  country: Yup.string()
    .test('country-test', inputErrors.country, (currentValue: string | undefined) => {
      return SELECT_OPTIONS.some(({ value }) => value === currentValue);
    })
    .required(inputErrors.required),
});
