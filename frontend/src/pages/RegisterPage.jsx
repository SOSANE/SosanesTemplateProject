// Components & fonction
import { useLocalization } from "../state/contexts/LocalizationContext";
import PageTemplate from "../components/PageTemplate";
import RegisterForm from "../components/commons/RegisterForm";

// Constants
import LOCALIZE from "../ressources/text/localize";

function RegisterPage() {
  const language = useLocalization();

  return (
    <PageTemplate title={LOCALIZE.registerPage.title}>
      <p>{LOCALIZE.registerPage.text1}</p>
      <RegisterForm />
    </PageTemplate>
  );
}

export default RegisterPage;
