import { Route, Routes } from "react-router-dom";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Error404Page from "./pages/Error404Page";

// Constants
import PATH from "./ressources/routes/paths";

function RouteList() {
  return (
    <Routes>
      <Route path={PATH.home} element={<HomePage />} />
      <Route path={PATH.login} element={<LoginPage />} />
      <Route path={PATH.register} element={<RegisterPage />} />

      <Route path="*" element={<Error404Page />} />
    </Routes>
  );
}

export default RouteList;
