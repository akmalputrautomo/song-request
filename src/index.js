import React from "react";
import ReactDOM from "react-dom/client";
import "./assets/css/index.css";
import { RouterList } from "./routes/RouterList";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterList />
    <Toaster />
  </React.StrictMode>,
);
