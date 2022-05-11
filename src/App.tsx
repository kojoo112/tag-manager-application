import { useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SearchContainer from "./components/SearchContainer";
import Home from "./screens/Home";

const App = () => {
  useEffect(() => {}, []);

  return (
    <div className="App">
      <Home />
    </div>
  );
};

export default App;
