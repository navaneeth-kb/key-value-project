import { useState } from "react";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import google from "../assets/Login/google.svg";

const StudentLogin = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const navigate = useNavigate();

  // --- Validation ---
  const validateFields = () => {
    const newErrors = {
      name: !name,
      email: !email,
      password: !password,
      confirmPassword: !confirmPassword || password !== confirmPassword,
    };
    setErrors(newErrors);
    return Object.values(newErrors).every((error) => !error);
  };

  // --- Helper: Check if Email is an Admin ---
  const checkIsAdmin = async (emailToCheck) => {
    try {
      // Check if a document exists in 'organiser' collection with this email ID
      const docRef = doc(db, "organiser", emailToCheck);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (error) {
      console.error("Error checking admin status:", error);
      return false;
    }
  };

  // --- Email Signup Handler ---
  const handleEmailSignup = async (e) => {
    e.preventDefault();
    setGeneralError("");
    
    if (!validateFields()) return;

    // 1. Check if this email is an Admin first
    const isAdmin = await checkIsAdmin(email);
    if (isAdmin) {
      setGeneralError("This email belongs to an Admin. Please use the Admin Login.");
      return;
    }

    // 2. Create Student Account
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate("/student-home"); // ✅ go to student homepage
    } catch (error) {
      console.error("Error signing up:", error);
      if (error.code === "auth/email-already-in-use") {
        setGeneralError("This email is already registered.");
      } else {
        setGeneralError("Signup failed. Please try again.");
      }
    }
  };

  // --- Google Signup Handler ---
  const handleGoogleSignup = async () => {
    setGeneralError("");
    const provider = new GoogleAuthProvider();

    try {
      // 1. Sign in with Google
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // 2. Check if this Google email is an Admin
      const isAdmin = await checkIsAdmin(user.email);

      if (isAdmin) {
        // Critical: Force logout if they are an admin trying to access student portal
        await signOut(auth);
        setGeneralError("You are an Admin. Please log in via the Admin portal.");
        return;
      }

      // 3. Navigate if valid student
      navigate("/student-home");
      
    } catch (error) {
      console.error("Google signup error:", error);
      setGeneralError("Google sign-in failed.");
    }
  };

  const handleNavigateToLogin = () => {
    navigate("/student-login");
  };

  const errorStyle = { borderColor: "red" };

  return (
    <div className="w-full h-screen bg-[#f6fcf7] flex flex-col items-center justify-center">
      <div className="w-[393px] flex flex-col items-center gap-[25px]">
        
        {/* Header */}
        <h2 className="text-[#246d8c] text-2xl font-bold">Student Signup</h2>

        {/* General Error Message */}
        {generalError && (
          <div className="w-[295px] p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm text-center">
            {generalError}
          </div>
        )}

        {/* Google Button */}
        <button
          className="bg-transparent flex items-center justify-center p-2"
          onClick={handleGoogleSignup}
        >
          <img src={google} alt="Sign in with Google" />
        </button>

        {/* Divider */}
        <div className="w-[295px] flex items-center relative">
          <div className="w-full h-px bg-[#111112]/20" />
          <div className="w-[22px] h-[19px] bg-[#f6fcf7] absolute left-[136px]" />
          <div className="text-black text-xs absolute left-[142px]">or</div>
        </div>

        {/* Form */}
        <form className="flex flex-col items-center gap-6" onSubmit={handleEmailSignup}>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrors((prev) => ({ ...prev, name: false }));
            }}
            className="w-[295px] h-12 px-4 rounded-md border"
            style={errors.name ? errorStyle : {}}
          />

          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors((prev) => ({ ...prev, email: false }));
            }}
            className="w-[295px] h-12 px-4 rounded-md border"
            style={errors.email ? errorStyle : {}}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setErrors((prev) => ({ ...prev, password: false }));
            }}
            className="w-[295px] h-12 px-4 rounded-md border"
            style={errors.password ? errorStyle : {}}
          />

          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev) => ({ ...prev, confirmPassword: false }));
            }}
            className="w-[295px] h-12 px-4 rounded-md border"
            style={errors.confirmPassword ? errorStyle : {}}
          />

          <button
            type="submit"
            className="w-[295px] py-3 bg-[#246d8c] text-white rounded-md font-medium shadow-md hover:bg-[#1d5870] transition-colors"
          >
            Create Account
          </button>
        </form>

        <div className="text-center">
          <span>Already a student? </span>
          <span
            className="font-medium cursor-pointer text-[#246d8c]"
            onClick={handleNavigateToLogin}
          >
            Log in.
          </span>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;