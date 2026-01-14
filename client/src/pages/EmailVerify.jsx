import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaUserLock } from "react-icons/fa";
import { useAuth } from "../context/AppContext";
import { useEffect, useRef } from "react";
import { toast } from "react-toastify";
axios.defaults.withCredentials = true;

const EmailVerify = () => {
  const navigate = useNavigate();
  const { isLoggedin, setIsLoggedin, backendUrl, getUserInfo, userInfo } =
    useAuth();
  const inputRefs = useRef([]);

  useEffect(() => {
    isLoggedin && userInfo && userInfo.isVerified && navigate("/");
  }, [isLoggedin, getUserInfo]);

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

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      const arrayOtp = inputRefs.current.map((e) => e.value);
      const otp = arrayOtp.join("");

      const res = await axios.post(backendUrl + "/api/auth/verify-account", {
        otp,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        getUserInfo();
        navigate("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div>
      <div className="min-h-screen flex flex-col justify-center items-center bg-linear-to-r from-cyan-500 to-blue-500">
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
            Email Verification
          </span>
          <h3 className="text-center capitalize font-semibold text-gray-800">
            enter 6 digit verification OTP
          </h3>
          <div className="mt-4">
            <form onSubmit={onSubmitHandler}>
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
                Verify Email
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerify;
