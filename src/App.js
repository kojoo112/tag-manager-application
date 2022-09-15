import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Home from "./screens/Home";
import Navigation from "./components/Navigation";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HintManager from "./screens/HintManager";

const App = () => {
  return (
    <div className="App">
      <Navigation />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/hint-manager" element={<HintManager />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
