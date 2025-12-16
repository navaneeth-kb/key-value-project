import React, { useEffect, useState } from "react";
import {
  WrenchScrewdriverIcon,
  ArrowRightOnRectangleIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase"; 
import { useNavigate } from "react-router-dom";

const StudentHomePage = () => {
  // 1. All useState hooks
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [roomNumber, setRoomNumber] = useState("");
  const [description, setDescription] = useState("");
  const [currentComplaint, setCurrentComplaint] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // 2. First useEffect (Auth Guard)
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setAuthLoading(false); 
      } else {
        navigate("/student-login", { replace: true });
      }
    });
    return () => unsub();
  }, [navigate]);

  // 3. Second useEffect (Real-time Complaint)
  // MOVED UP: This must be before any return statement!
  useEffect(() => {
    if (!roomNumber) {
      setCurrentComplaint(null);
      return;
    }

    const unsub = onSnapshot(doc(db, "maintenance", roomNumber), (docSnap) => {
      if (docSnap.exists()) {
        setCurrentComplaint(docSnap.data());
      } else {
        setCurrentComplaint(null);
      }
    });

    return () => unsub();
  }, [roomNumber]);

  // 4. NOW it is safe to return early (Conditional Rendering)
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6fcf7]">
        <p className="text-[#246d8c] font-semibold animate-pulse">Loading...</p>
      </div>
    );
  }

  // 5. Helper Functions
  const handleRaiseComplaint = async (e) => {
    e.preventDefault();
    if (!roomNumber || !description) return;

    setLoading(true);
    try {
      await setDoc(doc(db, "maintenance", roomNumber), {
        desc: description,
        status: "undone",
        studentEmail: user?.email || "Unknown",
        timestamp: new Date(),
      });
      setDescription(""); 
    } catch (err) {
      console.error(err);
      alert("Failed to submit complaint");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/", { replace: true });
  };

  // 6. Main Render
  return (
    <div className="min-h-screen bg-[#f6fcf7] pb-20">
      {/* HEADER */}
      <div className="bg-white px-6 py-6 shadow-sm rounded-b-3xl mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-[#246d8c]">
              Hello, Student
            </h1>
            <p className="text-gray-500 text-sm">{user?.email}</p>
          </div>
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-[#246d8c]" />
          </div>
        </div>
      </div>

      <div className="px-6 max-w-md mx-auto">
        {/* ROOM INPUT */}
        <div className="bg-white p-6 rounded-2xl shadow-sm mb-6 border border-blue-50">
          <label className="block font-semibold mb-2 text-gray-700">
            Enter your Room Number
          </label>
          <input
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value.trim())}
            placeholder="e.g. 101"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#246d8c]"
          />
        </div>

        {/* COMPLAINT SECTION */}
        {roomNumber && (
          <div className="animate-fade-in-up">
            {currentComplaint ? (
              <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-yellow-400">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-yellow-50 rounded-full">
                    <WrenchScrewdriverIcon className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h2 className="font-bold text-gray-800">Maintenance Pending</h2>
                </div>
                <div className="mb-4">
                   <p className="text-xs text-gray-400 uppercase font-semibold">Description</p>
                   <p className="text-gray-700">{currentComplaint.desc}</p>
                </div>
                <div className="flex items-center gap-2 bg-yellow-50 px-3 py-2 rounded-lg w-fit">
                   <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse"></span>
                   <span className="text-sm font-medium text-yellow-700">Status: In Progress</span>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <h2 className="font-bold mb-4 flex items-center gap-2 text-gray-800">
                  <WrenchScrewdriverIcon className="w-5 h-5 text-[#246d8c]" />
                  Raise Complaint
                </h2>
                <form onSubmit={handleRaiseComplaint}>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-[#246d8c]"
                    rows={4}
                    placeholder="Describe the issue (e.g., Fan not working)..."
                  />
                  <button
                    disabled={loading || !description}
                    className={`w-full py-3.5 rounded-xl font-semibold text-white transition-all ${
                       loading || !description 
                       ? "bg-gray-300 cursor-not-allowed" 
                       : "bg-[#246d8c] hover:bg-[#1d5870] shadow-md"
                    }`}
                  >
                    {loading ? "Submitting..." : "Submit Complaint"}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="fixed bottom-6 left-0 right-0 px-6 flex justify-center">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-3 bg-white text-red-500 font-semibold rounded-full shadow-lg border border-red-50 hover:bg-red-50 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          Logout
        </button>
      </div>
      
      <style>{`
        .animate-fade-in-up {
          animation: fadeInUp 0.5s ease-out forwards;
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default StudentHomePage;