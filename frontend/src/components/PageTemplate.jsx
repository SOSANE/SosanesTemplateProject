// Components & fonction
import Header from "./header/Header";
import Footer from "./footer/Footer";
import { useLocalization } from "../state/contexts/LocalizationContext";

function PageTemplate({ children, title }) {
  const language = useLocalization();

  return (
    <>
      <Header />
      <main className="pt-16 text-stone-900">
        <div className="p-4">
          <h1 className="mb-2 font-semibold">{title}</h1>
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}

export default PageTemplate;
