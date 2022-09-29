import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Home from "./screens/Home";
import TopNavbar from "./components/TopNavbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HintManager from "./screens/HintManager";

const App = () => {
  return (
    <div className="App">
      <TopNavbar />
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
