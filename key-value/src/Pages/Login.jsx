import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import google from "../assets/Login/google.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // =========================
  // EMAIL + PASSWORD LOGIN
  // =========================
  const handleEmailSignIn = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1️⃣ Firebase Auth login
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const userEmail = userCredential.user.email;

      // 2️⃣ Check organiser role in Firestore
      const organiserRef = doc(db, "organiser", userEmail);
      const organiserSnap = await getDoc(organiserRef);

      // 3️⃣ Role-based redirect
      if (organiserSnap.exists()) {
        navigate("/organiser");
      } else {
        navigate("/homepage");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to log in. Please check your credentials.");
    }
  };

  // =========================
  // GOOGLE LOGIN
  // =========================
  const handleGoogleSignIn = async () => {
    setError("");
    const provider = new GoogleAuthProvider();

    try {
      const userCredential = await signInWithPopup(auth, provider);
      const userEmail = userCredential.user.email;

      const organiserRef = doc(db, "organizers", userEmail);
      const organiserSnap = await getDoc(organiserRef);

      if (organiserSnap.exists()) {
        navigate("/organiser");
      } else {
        navigate("/homepage");
      }
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
            Log in
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
