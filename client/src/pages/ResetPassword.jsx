import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaUserLock } from "react-icons/fa";
import { useAuth } from "../context/AppContext";
import { toast } from "react-toastify";
axios.defaults.withCredentials = true;

const ResetPassword = () => {
  const { backendUrl } = useAuth();
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isSendEmail, setIsSendEmail] = useState(false);
  const [otp, setOtp] = useState(0);
  const [isSubmitOtp, setSubmitOtp] = useState(false);

  const inputHandler = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key == "Backspace" && e.target.value == "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");

    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmailHandler = async (e) => {
    try {
      e.preventDefault();
      const res = await axios.post(backendUrl + "/api/auth/send-reset-otp", {
        email,
      });
      res.data.success
        ? toast.success(res.data.message)
        : toast.error(res.data.message);
      res.data.success && setIsSendEmail(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const onSubmitOtpHandler = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((item) => item.value);
    setOtp(otpArray.join(""));
    setSubmitOtp(true);
  };

  const submitNewPassword = async (e) => {
    try {
      e.preventDefault();
      const { data } = await axios.post(
        backendUrl + "/api/auth/reset-password",
        { email, otp, password }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div className="min-h-screen flex flex-col justify-center items-center bg-linear-to-r from-cyan-500 to-blue-500">
        {!isSendEmail && (
          <div className="px-4 py-6 w-[90%] md:w-[50vw] lg:w-[30vw]  shadow bg-white rounded relative ">
            <div onClick={() => navigate("/")}>
              <FaArrowLeft className="absolute left-4 top-3 cursor-pointer text-lg  text-gray-800 font-medium" />
            </div>
            <h1 className="w-full flex justify-center items-center">
              <FaUserLock className="text-5xl font-bold mb-2 block text-gray-800" />
            </h1>
            <span className="text-2xl text-center block py-2 font-medium">
              Forgot Password
            </span>
            <h3 className="text-center font-semibold text-gray-800">
              with MERN Authentication System
            </h3>
            <div className="mt-4">
              <form onSubmit={onSubmitEmailHandler}>
                <input
                  type="text"
                  placeholder="Enter Email"
                  required
                  className="text-gray-800 outline-none border border-gray-400 text-[15px] bg-gray-100 px-4 rounded w-full py-2  mb-3"
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button
                  type="submit"
                  className="w-full py-2 rounded text-white font-semibold my-1 cursor-pointer bg-linear-to-r from-blue-500 to-cyan-500 transition-all duration-300 capitalize"
                >
                  Send OTP
                </button>
                <p className=" mt-2 text-sm font-medium text-gray-800">
                  Remember your password ?
                  <Link
                    to="/login"
                    type="button"
                    className="cursor-pointer text-gray-700 underline hover:text-gray-800 transition-all duration-300 ml-1"
                  >
                    Login
                  </Link>
                </p>
              </form>
            </div>
          </div>
        )}

        {/* forgot password otp model  */}
        {!isSubmitOtp && isSendEmail && (
          <div
            className="px-4 py-6 w-[90%] md:w-[50vw] lg:w-[30vw]  shadow bg-white rounded relative"
            onPaste={handlePaste}
          >
            <div onClick={() => navigate("/")}>
              <FaArrowLeft className="absolute left-4 top-3 cursor-pointer text-lg  text-gray-800 font-medium" />
            </div>
            <h1 className="w-full flex justify-center items-center">
              <FaUserLock className="text-5xl font-bold mb-2 block text-gray-800" />
            </h1>
            <span className="text-2xl text-center block py-2 font-medium">
              Forgot Password
            </span>
            <h3 className="text-center capitalize font-semibold text-gray-800">
              enter 6 digit forgot password OTP
            </h3>
            <div className="mt-4">
              <form onSubmit={onSubmitOtpHandler}>
                <div className="flex justify-between gap-1">
                  {Array(6)
                    .fill(0)
                    .map((_, index) => (
                      <input
                        key={index}
                        type="text"
                        required
                        maxLength={1}
                        className="text-gray-800 outline-none border border-gray-400 text-[18px] bg-gray-100 px-4 rounded w-12 h-12 mb-3"
                        ref={(e) => (inputRefs.current[index] = e)}
                        onInput={(e) => inputHandler(e, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                      />
                    ))}
                </div>
                <button
                  type="submit"
                  className="w-full py-2 rounded text-white font-semibold my-1 cursor-pointer bg-linear-to-r from-blue-500 to-cyan-500 transition-all duration-300 capitalize"
                >
                  submit
                </button>
              </form>
            </div>
          </div>
        )}
        {/* enter new password model  */}
        {isSubmitOtp && isSendEmail && (
          <div className="px-4 py-6 w-[90%] md:w-[50vw] lg:w-[30vw]  shadow bg-white rounded relative ">
            <div onClick={() => navigate("/")}>
              <FaArrowLeft className="absolute left-4 top-3 cursor-pointer text-lg  text-gray-800 font-medium" />
            </div>
            <h1 className="w-full flex justify-center items-center">
              <FaUserLock className="text-5xl font-bold mb-2 block text-gray-800" />
            </h1>
            <span className="text-2xl text-center block py-2 font-medium">
              Change Password
            </span>
            <h3 className="text-center font-semibold text-gray-800">
              with MERN Authentication System
            </h3>
            <div className="mt-4">
              <form onSubmit={submitNewPassword}>
                <input
                  type="text"
                  placeholder="Enter new password"
                  required
                  className="text-gray-800 outline-none border border-gray-400 text-[15px] bg-gray-100 px-4 rounded w-full py-2  mb-3"
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="submit"
                  className="w-full py-2 rounded text-white font-semibold my-1 cursor-pointer bg-linear-to-r from-blue-500 to-cyan-500 transition-all duration-300 capitalize"
                >
                  Change Password
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
