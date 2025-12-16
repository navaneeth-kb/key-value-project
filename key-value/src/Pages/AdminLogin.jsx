import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import google from "../assets/Login/google.svg";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // =========================
  // EMAIL + PASSWORD (ADMIN ONLY)
  // =========================
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userEmail = userCredential.user.email;

      // Check organiser collection
      const organiserRef = doc(db, "organiser", userEmail);
      const organiserSnap = await getDoc(organiserRef);

      if (!organiserSnap.exists()) {
        await signOut(auth);
        setError("Access denied. You are not an organiser.");
        return;
      }

      navigate("/adminHomepage");
    } catch (err) {
      console.error(err);
      setError("Invalid email or password.");
    }
  };

  // =========================
  // GOOGLE SIGN-IN (ADMIN ONLY)
  // =========================
  const handleGoogleSignIn = async () => {
    setError("");
    const provider = new GoogleAuthProvider();

    try {
      const userCredential = await signInWithPopup(auth, provider);
      const userEmail = userCredential.user.email;

      const organiserRef = doc(db, "organiser", userEmail);
      const organiserSnap = await getDoc(organiserRef);

      if (!organiserSnap.exists()) {
        await signOut(auth);
        setError("Access denied. You are not an organiser.");
        return;
      }

      navigate("/adminHomepage");
    } catch (err) {
      console.error(err);
      setError("Google sign-in failed.");
    }
  };

  return (
    <div className="h-screen bg-[#f5fbf7] flex justify-center items-center">
      <div className="flex flex-col items-center gap-6">
        {/* Google Login */}
        <button onClick={handleGoogleSignIn}>
          <img src={google} alt="Sign in with Google" />
        </button>

        <div className="text-xs text-gray-500">or</div>

        {/* Email Login */}
        <form onSubmit={handleEmailSignIn} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[295px] h-12 px-4 border rounded-md"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-[295px] h-12 px-4 border rounded-md"
            required
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-[295px] py-3 bg-[#246d8c] text-white rounded-md"
          >
            Admin Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
