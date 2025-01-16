import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import routes from "tempo-routes";
import Home from "./components/home";

function App() {
  return (
    <div>
      {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      <Routes>
        <Route path="/" element={<Home />} />
        
        {/* Add Tempo route before catchall */}
        {import.meta.env.VITE_TEMPO === "true" && <Route path="/tempobook/*" />}
        
        {/* Catchall route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}

export default App;
