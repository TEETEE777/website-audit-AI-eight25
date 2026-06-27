import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuditPage from "./pages/AuditPage";
import AuditHistory from "./pages/AuditHistory";
import AuditDetails from "./pages/AuditDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuditPage />} />

        <Route path="/history" element={<AuditHistory />} />

        <Route path="/audit/:id" element={<AuditDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
