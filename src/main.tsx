import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { CssBaseline } from "@mui/material";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <CssBaseline>
    <App />
  </CssBaseline>
);
