import { Route, Routes } from "react-router-dom";

import { Home } from "./comopnents/Home/Home";
import { Navbar } from "./comopnents/Navbar/Navbar";

import "./App.css";

function App() {
  return (
    <div className="App">
      <Navbar></Navbar>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
