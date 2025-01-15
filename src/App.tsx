import { Suspense } from "react";
import { useRoutes, Routes, Route, RouteObject } from "react-router-dom";
import Home from "./components/home";
import config from "../tempo.config.json";
import { AuthCallback } from './components/AuthCallback'
const routes = config.routes as unknown as RouteObject[];

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
      </Routes>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
    </div>
  );
}

export default App;
