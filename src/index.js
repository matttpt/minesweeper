import React from "react";
import ReactDOM from "react-dom/client";
import { Panel } from "./Panel";

const root = ReactDOM.createRoot(document.getElementById("minesweeper"));
root.render(React.createElement(Panel, null, null));
