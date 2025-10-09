// Constants
import LOCALIZE from "../../ressources/text/localize";
import { SET_LANGUAGE } from "../../state/actions";

// Components & fonction
import { useLocalization, useLocalizationDispatch } from "../../state/contexts/LocalizationContext";

function ChangeLanguage() {
  const language = useLocalization();
  const dispatch = useLocalizationDispatch();

  return (
    <button
      className="rounded-lg bg-stone-800 p-2 text-stone-50 hover:bg-stone-950 hover:text-stone-200"
      onClick={() => dispatch({ type: SET_LANGUAGE, language: LOCALIZE.langueContraire })}
    >
      {LOCALIZE.header.changeLanguage}
    </button>
  );
}

export default ChangeLanguage;
