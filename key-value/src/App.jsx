import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Splash from "./Pages/Splash";
import AdminLogin from "./Pages/AdminLogin";
import StudentLogin from "./Pages/StudentLogin";

import StudentHomePage from "./Pages/StudentHomePage";
import AdminHomePage from "./Pages/Admin/AdminHomePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/login" element={<AdminLogin />} />

        {/* Student routes */}
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-home" element={<StudentHomePage />} />

        {/* Admin routes */}
        <Route path="/adminHomepage" element={<AdminHomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
