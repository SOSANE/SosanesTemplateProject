// Components & fonction
import PageTemplate from "../components/PageTemplate";
import { useLocalization } from "../state/contexts/LocalizationContext";

// Constants
import LOCALIZE from "../ressources/text/localize";

function HomePage() {
  const language = useLocalization();

  return (
    <PageTemplate title={LOCALIZE.homepage.title}>
      <p>{LOCALIZE.homepage.text1}</p>
    </PageTemplate>
  );
}

export default HomePage;
