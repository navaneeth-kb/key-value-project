import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HomeIcon, UserIcon } from "@heroicons/react/24/outline";
import { onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase";
import hi from "../../assets/Home/hi.svg";

const OrgHomePage = () => {
  const navigate = useNavigate();

  const [organizerName, setOrganizerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeEvents, setActiveEvents] = useState([]);
  const [closedEvents, setClosedEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [eventFilter, setEventFilter] = useState("active");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setOrganizerName("Guest");
        setLoading(false);
        return;
      }

      try {
        // 🔹 fetch organiser profile
        const organiserRef = doc(db, "organiser", user.email);
        const organiserSnap = await getDoc(organiserRef);

        if (organiserSnap.exists()) {
          setOrganizerName(organiserSnap.data().name);
        } else {
          setOrganizerName("Organizer");
        }

        // 🔹 fetch organiser events
        const querySnapshot = await getDocs(collection(db, "event"));

        const userEvents = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
            isClosed: doc.data().status === "closed",
          }))
          .filter((event) => event.organiser === user.email);

        setActiveEvents(userEvents.filter((e) => !e.isClosed));
        setClosedEvents(userEvents.filter((e) => e.isClosed));
      } catch (err) {
        console.error("Error loading organiser data:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const filteredEvents =
    (eventFilter === "active" ? activeEvents : closedEvents).filter((event) =>
      event.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <div className="w-full min-h-screen bg-[#F6FCF7] flex flex-col items-center pb-20">
      {/* ===== HERO ===== */}
      <br></br>
      <div className="relative w-full max-w-3xl mb-6 px-4">
        <img src={hi} alt="Welcome" className="w-full rounded-2xl" />
        <div className="absolute top-4 left-6 text-white">
          <h1 className="text-xl font-bold">Welcome back</h1>
          <h2 className="text-3xl font-extrabold">
            {loading ? "Loading..." : organizerName}
          </h2>
        </div>
      </div>

      {/* ===== SEARCH ===== */}
      <div className="w-full max-w-3xl px-4 mb-4">
        <input
          type="text"
          placeholder="Search events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#246D8C]"
        />
      </div>

      {/* ===== TABS ===== */}
      <div className="w-full max-w-3xl px-4 mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setEventFilter("active")}
            className={`py-2 px-6 ${
              eventFilter === "active"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
          >
            Active Events
          </button>
          <button
            onClick={() => setEventFilter("closed")}
            className={`py-2 px-6 ${
              eventFilter === "closed"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-500"
            }`}
          >
            Closed Events
          </button>
        </div>
      </div>

      {/* ===== EVENTS ===== */}
      <div className="w-full max-w-3xl px-4">
        {loading ? (
          <p className="text-center">Loading events...</p>
        ) : filteredEvents.length === 0 ? (
          <p className="text-center">No events found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredEvents.map((event) => (
              <Link
                key={event.id}
                to={`/organiser/${event.id}`}
                className="bg-white rounded-xl shadow p-4"
              >
                <div className="aspect-square mb-3">
                  <img
                    src={event.poster}
                    alt={event.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <h4 className="font-semibold text-center">{event.name}</h4>
                <p className="text-sm text-gray-600 text-center">
                  {event.venue}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ===== BOTTOM NAV ===== */}
      <div className="fixed bottom-0 left-0 right-0 bg-white h-16 border-t flex justify-around items-center z-50">
        <button
          onClick={() => navigate("/organiser")}
          className="flex flex-col items-center"
        >
          <HomeIcon className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </button>

        <button
          onClick={() => navigate("/organiser/profile")}
          className="flex flex-col items-center"
        >
          <UserIcon className="h-6 w-6" />
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default OrgHomePage;
