import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Splash = () => {
  const [showButtons, setShowButtons] = useState(false); // State to control buttons visibility
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    // Show buttons after 2 seconds
    const timer = setTimeout(() => {
      setShowButtons(true); // Show the buttons after the logo animation
    }, 2000);

    // Cleanup timer on component unmount
    return () => clearTimeout(timer);
  }, []);

  // Handlers for logins
  const handleAdminLogin = () => {
    navigate('/login'); // Navigate to Admin login page
  };

  const handleStudentLogin = () => {
    navigate('/student-login'); // Navigate to Student login page
  };

  return (
    <div className="w-full h-screen bg-[#f6fcf7] flex flex-col justify-center items-center p-4">
      {/* Text Logo Replacement with fade-in effect */}
      <div
        className="mb-10 text-center transition-opacity duration-1000 opacity-100"
        style={{ animation: 'fadeIn 3s ease-in-out' }}
      >
        <h1 className="text-[#246d8c] text-6xl font-extrabold font-['Inter'] tracking-wider mb-2">
          PGMS
        </h1>
        <p className="text-[#246d8c] text-xl font-semibold font-['Inter'] tracking-wide">
          PG Management System
        </p>
      </div>
      
      {/* Content after the logo animation */}
      {showButtons && (
        <div className="flex flex-col items-center animate-fade-in-up">
          <div className="text-[#246d8c] text-[32px] font-medium font-['Inter'] mb-8">
            Let’s get started
          </div>
          
          {/* Admin Button */}
          <button
            onClick={handleAdminLogin}
            className="w-[295px] py-[13px] bg-[#246d8c] text-white text-base font-medium font-['Inter'] rounded-md mb-4 shadow-md hover:bg-[#1d5870] transition-colors"
          >
            Admin Login
          </button>

          {/* Student Login Button */}
          <button
            onClick={handleStudentLogin}
            className="w-[295px] py-[13px] bg-[#246d8c] text-white text-base font-medium font-['Inter'] rounded-md shadow-md hover:bg-[#1d5870] transition-colors"
          >
            Student Login
          </button>
          
        </div>
      )}

      {/* Basic Keyframes for animation */}
      <style>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Splash;