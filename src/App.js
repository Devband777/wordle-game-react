import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import MyChart from "./pages/MyChart";
import Project from "./pages/Projects";
import Resume from "./pages/Resume";
import Contact from "./pages/Contact";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Preloader from "./components/PreLoader";
import ScrollToTop from "./components/ScrollToTop";

import "./App.css";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";
import initData from "./data.json";
import { Api, HttpURL } from "./utils.js";

function App() {
  const [load, upadateLoad] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      upadateLoad(false);
    }, 1200);
    // Api.put(HttpURL, initData)
    //   .then((res) => console.log("Data Saved: ", res.data.record))
    //   .catch((err) => console.log("Error: ", err));
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <Preloader load={load} />
      <div className="App" id={load ? "no-scroll" : "scroll"}>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chart" element={<MyChart />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
