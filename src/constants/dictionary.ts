import { CountryLocale, TLocalizedString } from '../types/types';
import { AppStrings } from './appStrings';

export const dictionary: Record<string, Partial<TLocalizedString>> = {
  [AppStrings.Catalog]: {
    [CountryLocale.DE]: 'Katalog',
  },
  [AppStrings.Cart]: {
    [CountryLocale.DE]: 'Warenkorb',
  },
  [AppStrings.Profile]: {
    [CountryLocale.DE]: 'Profil',
  },
  [AppStrings.LogIn]: {
    [CountryLocale.DE]: 'Anmelden',
  },
  [AppStrings.LogOut]: {
    [CountryLocale.DE]: 'Abmelden',
  },
  [AppStrings.Email]: {
    [CountryLocale.DE]: 'Email',
  },
  [AppStrings.Password]: {
    [CountryLocale.DE]: 'Passwort',
  },
  [AppStrings.FirstName]: {
    [CountryLocale.DE]: 'Vorname',
  },
  [AppStrings.LastName]: {
    [CountryLocale.DE]: 'Nachname',
  },
  [AppStrings.DateOfBirth]: {
    [CountryLocale.DE]: 'Geburtsdatum',
  },
  [AppStrings.ShippingAddress]: {
    [CountryLocale.DE]: 'Lieferadresse',
  },
  [AppStrings.SetAsDefaultShippingAddress]: {
    [CountryLocale.DE]: 'Als Standard-Lieferadresse festlegen',
  },
  [AppStrings.Street]: {
    [CountryLocale.DE]: 'Street',
  },
  [AppStrings.City]: {
    [CountryLocale.DE]: 'Stadt',
  },
  [AppStrings.Country]: {
    [CountryLocale.DE]: 'Land',
  },
  [AppStrings.PostalCode]: {
    [CountryLocale.DE]: 'Postleitzahl',
  },
  [AppStrings.BillingAddress]: {
    [CountryLocale.DE]: 'Rechnungsadresse',
  },
  [AppStrings.TheSameAsShippingAddress]: {
    [CountryLocale.DE]: 'Das gleiche wie Lieferadresse',
  },
  [AppStrings.SetAsDefaultBillingAddress]: {
    [CountryLocale.DE]: 'Als Standard-Rechnungsadresse festlegen',
  },
  [AppStrings.Register]: {
    [CountryLocale.DE]: 'Registrieren',
  },
  [AppStrings.QAlreadyHaveAnAccount]: {
    [CountryLocale.DE]: 'Haben Sie bereits ein Konto?',
  },
  [AppStrings.QDontHaveAnAccountYet]: {
    [CountryLocale.DE]: 'Sie haben noch kein Konto?',
  },
  [AppStrings.User]: {
    [CountryLocale.DE]: 'Benutzer',
  },
  [AppStrings.RegistrationHasBeenCompleted]: {
    [CountryLocale.DE]: 'Die Registrierung wurde abgeschlossen',
  },
};
