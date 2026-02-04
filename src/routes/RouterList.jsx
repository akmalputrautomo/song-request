import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Home } from "../assets/pages/Home";
import { Request } from "../assets/pages/Request";
import { Qris } from "../assets/pages/Qris";

export const RouterList = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Request" element={<Request />} />
        <Route path="/Qris" element={<Qris />} />
      </Routes>
    </BrowserRouter>
  );
};
