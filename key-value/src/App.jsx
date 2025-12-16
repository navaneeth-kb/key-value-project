import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Splash from "./Pages/Splash";
import AdminLogin from "./Pages/AdminLogin";
import HomePage from "./Pages/HomePage";
import SignUp from "./Pages/SignUp";

import AdminHomePage from "./Pages/Admin/AdminHomePage";
import OrganiserProfile from "./Pages/Admin/OrgProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/signup" element={<SignUp />} />

        {/* User homepage */}
        <Route path="/homepage" element={<HomePage />} />

        {/* Organiser routes */}
        <Route path="/adminHomepage" element={<AdminHomePage />} />
        
        <Route path="/organiser/profile" element={<OrganiserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
