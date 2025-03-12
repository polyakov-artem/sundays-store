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
  oneOf: (chars: string) => `Must contain one of the characters ${chars}`,
  length: (min: number, max: number) => `Must be ${min}-${max} characters long`,
};
