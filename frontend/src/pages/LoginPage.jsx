// Components & fonction
import PageTemplate from "../components/PageTemplate";
import { useLocalization } from "../state/contexts/LocalizationContext";
import LoginForm from "../components/commons/LoginForm";

// Constants
import LOCALIZE from "../ressources/text/localize";

function LoginPage() {
  const language = useLocalization();

  return (
    <PageTemplate title={LOCALIZE.loginpage.title}>
      <p>{LOCALIZE.loginpage.text1}</p>
      <LoginForm />
    </PageTemplate>
  );
}

export default LoginPage;
