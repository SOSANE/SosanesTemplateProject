import { createContext, useContext } from "react";

export const LocalizationContext = createContext(null);
export const LocalizationDispatchContext = createContext(null);

export function useLocalization() {
  return useContext(LocalizationContext);
}

export function useLocalizationDispatch() {
  return useContext(LocalizationDispatchContext);
}
