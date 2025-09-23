import { useState } from "react";

// Components & fonction
import { useLocalization } from "../../state/contexts/LocalizationContext";

// Constants
import LOCALIZE from "../../ressources/text/localize";
import PATH from "../../ressources/routes/paths";

function RegisterForm() {
  const language = useLocalization();
  const firstName = useState("");
  const lastName = useState("");
  const username = useState("");
  const email = useState("");
  const password = useState("");
  const confirmPassword = useState("");

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div className="max-w-lg overflow-hidden rounded shadow-lg">
      <div className="p-4">
        <form id="registration-form" className="flex flex-col" onSubmit={e => handleSubmit(e)}>
          <div className="flex flex-row p-2">
            <div className="flex flex-col px-2">
              <label className="text-left">{LOCALIZE.registerPage.form.firstNameLabel}</label>
              <input
                type="text"
                id="register-form-first-name-input"
                required
                aria-required
                name={firstName}
                aria-label={LOCALIZE.registerPage.form.firstNamePlaceholder}
                placeholder={LOCALIZE.registerPage.form.firstNamePlaceholder}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-left">{LOCALIZE.registerPage.form.lastNameLabel}</label>
              <input
                type="text"
                id="register-form-last-name-input"
                required
                aria-required
                name={lastName}
                aria-label={LOCALIZE.registerPage.form.lastNamePlaceholder}
                placeholder={LOCALIZE.registerPage.form.lastNamePlaceholder}
              />
            </div>
          </div>

          <div className="flex flex-col p-2">
            <label className="text-left">{LOCALIZE.registerPage.form.usernameLabel}</label>
            <input
              type="text"
              id="register-form-username-input"
              required
              aria-required
              name={username}
              aria-label={LOCALIZE.registerPage.form.usernamePlaceholder}
              placeholder={LOCALIZE.registerPage.form.usernamePlaceholder}
            />
          </div>

          <div className="flex flex-col p-2">
            <label className="text-left">{LOCALIZE.registerPage.form.emailLabel}</label>
            <input
              type="email"
              id="register-form-email-input"
              required
              aria-required
              name={email}
              aria-label={LOCALIZE.registerPage.form.emailPlaceholder}
              placeholder={LOCALIZE.registerPage.form.emailPlaceholder}
            />
          </div>

          <div className="flex flex-col p-2">
            <label className="text-left">{LOCALIZE.registerPage.form.passwordLabel}</label>
            <input
              type="password"
              id="register-form-password-input"
              required
              aria-required
              name={password}
              aria-label={LOCALIZE.registerPage.form.passwordPlaceholder}
              placeholder={LOCALIZE.registerPage.form.passwordPlaceholder}
            />
          </div>

          <div className="flex flex-col px-2 py-4">
            <label className="text-left">{LOCALIZE.registerPage.form.confirmPasswordLabel}</label>
            <input
              type="email"
              id="register-form-confirm-password-input"
              required
              aria-required
              name={confirmPassword}
              aria-label={LOCALIZE.registerPage.form.passwordPlaceholder}
              placeholder={LOCALIZE.registerPage.form.passwordPlaceholder}
            />
          </div>

          <input
            type="submit"
            id="register-form-submit"
            value={LOCALIZE.registerPage.form.buttonLabel}
            className="rounded-sm bg-stone-800 p-2 text-stone-50 hover:bg-stone-950 hover:text-stone-200"
          />
          <a href={PATH.login} className="pt-4">
            {LOCALIZE.registerPage.form.loginAccount}
          </a>
        </form>
      </div>
    </div>
  );
}

export default RegisterForm;
