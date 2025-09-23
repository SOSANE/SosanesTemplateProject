// Components & fonction
import NavBar from "./NavBar";
import { useLocalization } from "../../state/contexts/LocalizationContext";

function Header() {
  const language = useLocalization();

  return (
    <header className="fixed top-0 left-0 w-full">
      <NavBar />
    </header>
  );
}

export default Header;
