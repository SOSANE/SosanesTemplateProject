import { useLocalization } from "../../state/contexts/LocalizationContext";

// Constants
import LOCALIZE from "../../ressources/text/localize";
import PATH from "../../ressources/routes/paths";

function Footer() {
  const language = useLocalization();

  return (
    <footer className="fixed bottom-0 left-0 w-full text-stone-900">
      <div className="py-4 text-center">
        © 2025 Copyright:
        <a href={PATH.home}> {LOCALIZE.title}</a>
      </div>
    </footer>
  );
}

export default Footer;
