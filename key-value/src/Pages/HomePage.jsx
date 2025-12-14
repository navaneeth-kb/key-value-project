import React, { useEffect, useState } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import {
  HomeIcon,
  TicketIcon,
  CalendarIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import hi from "../assets/Home/hi.svg"
import Profile from "./Profile";
import { useLocation } from "react-router-dom";

const db = getFirestore();

const HomePage = () => {
  const [userName, setUserName] = useState(null);
  const [activeTab, setActiveTab] = useState("home");
  const location = useLocation();
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  /* Handle screen resize */
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* Auth listener */
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserName(user ? user.displayName : "Guest");
    });
    return () => unsubscribe();
  }, []);

  /* ------------------ NAVS ------------------ */

  const renderDesktopNavigation = () => (
    <div className="w-64 h-screen bg-white border-r fixed left-0 top-0 p-6 flex flex-col">
      <h1 className="text-2xl font-bold text-blue-600 mb-8">Eventique</h1>

      <nav className="flex-1 space-y-2">
        {[
          ["home", HomeIcon, "Home"],
          ["tickets", TicketIcon, "Tickets"],
          ["months", CalendarIcon, "Events"],
          ["profile", UserIcon, "Profile"],
        ].map(([key, Icon, label]) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex items-center w-full p-3 rounded-lg ${
              activeTab === key
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <Icon className="h-6 w-6 mr-3" />
            {label}
          </button>
        ))}
      </nav>
    </div>
  );

  const renderMobileNavigation = () => (
    <div className="fixed bottom-0 left-0 w-full h-16 bg-white border-t border-gray-200 flex justify-around items-center z-[100]">
      {[
        ["home", HomeIcon, "Home"],
        ["tickets", TicketIcon, "Tickets"],
        ["months", CalendarIcon, "Events"],
        ["profile", UserIcon, "Profile"],
      ].map(([key, Icon, label]) => (
        <button
          key={key}
          onClick={() => setActiveTab(key)}
          className={`flex flex-col items-center ${
            activeTab === key ? "text-blue-500" : "text-gray-500"
          }`}
        >
          <Icon className="h-6 w-6" />
          <span className="text-xs mt-1">{label}</span>
        </button>
      ))}
    </div>
  );

  /* ------------------ CONTENT ------------------ */

  const renderTabContent = () => {
    if (activeTab === "profile") return <Profile />;

    return (
      <div
        className={`p-4 flex flex-col items-center ${
          isDesktop ? "ml-64" : ""
        }`}
      >
        {/* Welcome Banner */}
        <div className={`relative w-full ${isDesktop ? "max-w-4xl" : "max-w-2xl"}`}>
          {isDesktop ? (
            <div className="flex items-center p-8 bg-[#246d8c] rounded-2xl shadow-xl">
              <div className="flex-1 text-white">
                <h1 className="text-4xl font-bold">Welcome back</h1>
                <h2 className="text-5xl font-extrabold mt-1">
                  {userName || "Guest"}
                </h2>
                <p className="mt-2 text-blue-100">
                  Discover and manage events all in one place.
                </p>
              </div>
              <img src={hi} alt="Welcome" className="h-48 ml-6" />
            </div>
          ) : (
            <>
              <img src={hi} alt="Welcome" className="w-full rounded-xl mb-6" />
              <div className="absolute top-4 left-4 text-white">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <h2 className="text-3xl font-extrabold">
                  {userName || "Guest"}
                </h2>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  /* ------------------ LAYOUT ------------------ */

  return (
    <div className="w-full min-h-screen flex flex-col bg-[#f6fcf7] relative">
      {isDesktop && renderDesktopNavigation()}

      <div
        className={`flex-1 w-full overflow-y-auto ${
          isDesktop ? "" : "pb-20"
        }`}
      >
        {renderTabContent()}
      </div>

      {!isDesktop && renderMobileNavigation()}
    </div>
  );
};

export default HomePage;
