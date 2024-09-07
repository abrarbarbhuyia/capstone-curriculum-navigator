import React from "react";
import "./App.css";
import Header from "./components/header";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Chat";

function App() {
  return (
    <div>
      <Header />
      <Routes>
        <Route exact path="/" Component={Home} />
        <Route exact path="/chat" Component={Chat} />
      </Routes>
    </div>
  );
}

export default App;
