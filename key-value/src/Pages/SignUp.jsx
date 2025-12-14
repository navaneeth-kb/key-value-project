import { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import google from "../assets/Login/google.svg";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const navigate = useNavigate();

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

    const handleEmailSignup = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate("/HomePage"); // ✅ go to homepage
    } catch (error) {
        console.error("Error signing up with email:", error);
    }
    };

    const handleGoogleSignup = async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        navigate("/HomePage"); // ✅ go to homepage
    } catch (error) {
        console.error("Error signing up with Google:", error);
    }
    };


  const handleNavigateToLogin = () => {
    navigate("/login");
  };

  const errorStyle = {
    borderColor: "red",
  };

  return (
    <div className="w-full h-screen bg-[#f6fcf7] flex flex-col items-center justify-center">
      <div className="w-[393px] flex flex-col items-center gap-[25px]">
        <button
          className="bg-transparent flex items-center justify-center p-2"
          onClick={handleGoogleSignup}
        >
          <img src={google} alt="Sign in with Google" />
        </button>

        <div className="w-[295px] flex items-center relative">
          <div className="w-full h-px bg-[#111112]/20" />
          <div className="w-[22px] h-[19px] bg-[#f6fcf7] absolute left-[136px]" />
          <div className="text-black text-xs absolute left-[142px]">
            or
          </div>
        </div>

        <form
          className="flex flex-col items-center gap-6"
          onSubmit={handleEmailSignup}
        >
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
            className="w-[295px] py-3 bg-[#246d8c] text-white rounded-md font-medium"
          >
            Join us
          </button>
        </form>

        <div className="text-center">
          <span>Already a member? </span>
          <span
            className="font-medium cursor-pointer"
            onClick={handleNavigateToLogin}
          >
            Log in.
          </span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
