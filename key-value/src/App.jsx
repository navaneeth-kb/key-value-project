import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Splash from "./Pages/Splash";
import AdminLogin from "./Pages/AdminLogin";


import AdminHomePage from "./Pages/Admin/AdminHomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<AdminLogin />} />


        {/* Organiser routes */}
        <Route path="/adminHomepage" element={<AdminHomePage />} />
        
      </Routes>
    </Router>
  );
}

export default App;
