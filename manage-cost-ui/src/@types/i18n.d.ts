// import the original type declarations
import "i18next";
// import all namespaces (for the default language, only)
import common from "../../public/locales/ru/common.json";
import trip from "../../public/locales/ru/trip.json";
import profile from "../../public/locales/ru/profile.json";
import auth from "../../public/locales/ru/auth.json";
import ru from "date-fns/locale/ru";

const translation = { datePickerLocale: ru };

declare module "i18next" {
  // Extend CustomTypeOptions
  interface CustomTypeOptions {
    // custom namespace type, if you changed it
    defaultNS: "common";
    // custom resources type
    resources: {
      common: typeof common;
      trip: typeof trip;
      profile: typeof profile;
      auth: typeof auth;
      translation: typeof translation;
    };
    // other
  }
}
