// Components & fonction
import { useLocalization } from "../../state/contexts/LocalizationContext";
import ChangeLanguage from "./ChangeLanguage";

// Constants
import PATH from "../../ressources/routes/paths";
import LOCALIZE from "../../ressources/text/localize";

function NavBar() {
  const language = useLocalization();

  return (
    <nav className="py-5 shadow-md">
      <div className="mx-auto flex items-center px-8 lg:container">
        <div className="w-2/3 max-w-full">
          <a href={PATH.home} className="flex w-full items-center justify-start">
            <span className="ml-2 text-2xl font-semibold text-stone-900">{LOCALIZE.title}</span>
          </a>
        </div>

        <div className="flex w-1/3 items-center justify-end">
          <a href={PATH.login} className="pr-3">
            {LOCALIZE.loginpage.title}
          </a>
          <ChangeLanguage />
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
