import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { HomeIcon, UserIcon } from "@heroicons/react/24/outline";
import { auth, db } from "../../firebase";

const OrganiserProfile = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      const user = auth.currentUser;

      if (!user) {
        navigate("/login");
        return;
      }

      const email = user.email;

      try {
        const docRef = doc(db, "organiser", email);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setProfile({
            name: docSnap.data().name || "Not provided",
            email,
          });
        } else {
          setProfile({
            name: "Not provided",
            email,
          });
        }
      } catch (err) {
        console.error("Error fetching organiser profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6FCF7] pb-20 px-4">
      {/* Profile Card */}
      <div className="max-w-md mx-auto mt-10 bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-2">
          Organiser Profile
        </h2>
        <p className="text-center text-gray-500 mb-6">
          View your account details
        </p>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-600">
            {profile.name.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-lg font-medium">{profile.name}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="text-lg font-medium break-all">
              {profile.email}
            </p>
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full mt-8 bg-red-500 text-white py-3 rounded-lg font-semibold hover:bg-red-600"
        >
          Log out
        </button>
      </div>

      {/* ✅ Bottom Navigation (FIXED) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t h-16 flex justify-around items-center z-50">
        <button
          onClick={() => navigate("/organiser")}
          className="flex flex-col items-center"
        >
          <HomeIcon className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </button>

        <button className="flex flex-col items-center text-blue-500">
          <UserIcon className="h-6 w-6" />
          <span className="text-xs">Profile</span>
        </button>
      </div>
    </div>
  );
};

export default OrganiserProfile;
