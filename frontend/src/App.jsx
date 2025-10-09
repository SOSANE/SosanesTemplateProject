import "./App.css";
import { BrowserRouter } from "react-router-dom";
import RouteList from "./RouteList";

function App() {
  return (
    <BrowserRouter>
      <RouteList />
    </BrowserRouter>
  );
}

export default App;
