import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Splash from "./Pages/Splash";
import Login from "./Pages/Login";
import HomePage from "./Pages/HomePage";
import SignUp from "./Pages/SignUp";

import EventSection from "./Pages/Organiser/OrgHomePage";
import OrganiserProfile from "./Pages/Organiser/OrgProfile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* User homepage */}
        <Route path="/homepage" element={<HomePage />} />

        {/* Organiser routes */}
        <Route path="/organiser" element={<EventSection />} />
        <Route path="/organiser/:eventId" element={<EventSection />} />
        <Route path="/organiser/profile" element={<OrganiserProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
