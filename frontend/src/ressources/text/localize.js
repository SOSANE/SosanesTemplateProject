import LocalizedStrings from "react-localization";
import EN from "./en";
import FR from "./fr";

const LANGUES = {
  francais: "fr",
  anglais: "en",
};

export const LOCALIZE = new LocalizedStrings({
  fr: FR,
  en: EN,
});

export default LOCALIZE;
