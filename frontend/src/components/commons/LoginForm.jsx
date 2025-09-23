import { useState } from "react";

// Components & fonction
import { useLocalization } from "../../state/contexts/LocalizationContext";

// Constants
import LOCALIZE from "../../ressources/text/localize";
import PATH from "../../ressources/routes/paths";

function LoginForm() {
  const language = useLocalization();
  const username = useState("");
  const password = useState("");

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div className="max-w-lg overflow-hidden rounded shadow-lg">
      <div className="px-6 py-6">
        <form id="login-form" className="flex flex-col px-5" onSubmit={e => handleSubmit(e)}>
          <div className="flex flex-col py-4">
            <label className="text-left">{LOCALIZE.loginpage.form.usernameLabel}</label>
            <input
              type="text"
              id="login-form-username"
              name={username}
              required
              aria-required
              aria-label={LOCALIZE.loginpage.form.usernamePlaceholder}
              placeholder={LOCALIZE.loginpage.form.usernamePlaceholder}
            />
          </div>
          <div className="flex flex-col py-4">
            <label className="text-left">{LOCALIZE.loginpage.form.passwordLabel}</label>
            <input
              type="password"
              id="login-form-password"
              name={password}
              required
              aria-required
              aria-label={LOCALIZE.loginpage.form.passwordPlaceHolder}
              placeholder={LOCALIZE.loginpage.form.passwordPlaceHolder}
            />
          </div>

          <input
            type="submit"
            id="login-form-submit"
            value={LOCALIZE.loginpage.form.buttonLabel}
            className="rounded-sm bg-stone-800 p-2 text-stone-50 hover:bg-stone-950 hover:text-stone-200"
          />
          <a href={PATH.register} className="pt-4">
            {LOCALIZE.loginpage.form.registerAccount}
          </a>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
