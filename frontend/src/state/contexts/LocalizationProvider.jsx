import { useReducer } from "react";
import { LocalizationContext, LocalizationDispatchContext } from "./LocalizationContext";
import localizationReducer, { setLanguage } from "../reducers/localizationReducer";

export function LocalizationProvider({ children }) {
  const [language, dispatch] = useReducer(localizationReducer, setLanguage());

  return (
    <LocalizationContext value={language}>
      <LocalizationDispatchContext value={dispatch}>{children}</LocalizationDispatchContext>
    </LocalizationContext>
  );
}
