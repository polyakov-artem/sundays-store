export const PUBLIC_PATH = '/';

export const inputErrors = {
  whitespaces: 'Must not contain whitespaces',
  emailSeparator: `Must contain an '@' symbol`,
  domainName: 'Must contain a domain name (e.g., example.com).',
  email: `Incorrect email address`,
  required: 'Must not be empty',
  uppercaseLetter: `Must contain at least one uppercase letter (A-Z)`,
  lowercaseLetter: `Must contain at least one lowercase letter (a-z)`,
  digit: `Must contain at least one digit (0-9)`,
  charsWithoutNumbersAndSpecials:
    'Must contain at least one character and no special characters or numbers',
  chars: 'Must contain at least one character',
  postalCode: `Must follow the format for the country (e.g., 12345)`,
  country: 'Must be a valid country',
  date: 'Date must be in DD-MM-19** or DD-MM-20** format',
  oneOf: (chars: string) => `Must contain one of the characters ${chars}`,
  length: (min: number, max: number) => `Must be ${min}-${max} characters long`,
  age: (min: number) => `Age must be at least ${min} years old.`,
};

export const regexps = {
  onlyNonWhitespaces: /^\S+$/,
  containsEmailSeparator: /@/,
  containsDomainName: /@\S+\.\S+/,
  containsUppercaseLetter: /[A-Z]/,
  containsLowercaseLetter: /[a-z]/,
  containsDigit: /[0-9]/,
  charsWithoutNumbersAndSpecials: /^[A-Za-z]+$/,
  containsChar: /\S/,
  postalCode: /^([0-9]+)$/,
  dateYYYYMMDDFormat: /^(19|20)[0-9]{2}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/,
};
