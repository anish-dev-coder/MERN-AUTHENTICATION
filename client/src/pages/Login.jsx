import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaUserLock } from "react-icons/fa";
import { useAuth } from "../context/AppContext";
import { toast } from "react-toastify";
axios.defaults.withCredentials = true;

const Login = () => {
  const navigate = useNavigate();
  const { setIsLoggedin, backendUrl, getUserInfo } = useAuth();
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (state == "register") {
        const { data } = await axios.post(backendUrl + "/api/auth/register", {
          name,
          email,
          password,
        });
        if (data.success) {
          toast.success(data.message);
          setIsLoggedin(true);
          getUserInfo();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(backendUrl + "/api/auth/login", {
          email,
          password,
        });
        if (data.success) {
          toast.success(data.message);
          setIsLoggedin(true);
          getUserInfo();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(data.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-linear-to-r from-cyan-500 to-blue-500">
      <div className="px-4 py-6 w-[90%] md:w-[50vw] lg:w-[30vw]  shadow bg-white rounded relative">
        <div onClick={() => navigate("/")}>
          <FaArrowLeft className="absolute left-4 top-3 cursor-pointer text-lg  text-gray-800 font-medium" />
        </div>
        <h1 className="w-full flex justify-center items-center">
          <FaUserLock className="text-5xl font-bold mb-2 block text-gray-800" />
        </h1>
        <span className="text-2xl text-center block py-2 font-medium">
          {state == "register" ? "Register" : "Login"}
        </span>
        <h3 className="text-center font-semibold text-gray-800">
          with MERN Authentication System
        </h3>
        <div className="mt-4">
          <form onSubmit={onSubmitHandler}>
            {state == "register" && (
              <input
                type="text"
                name="user"
                placeholder="Enter fullname"
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full text-gray-800 block py-2 px-3 outline-none border border-gray-300 bg-gray-100  rounded mb-3"
              />
            )}
            <input
              type="text"
              name="email"
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full text-gray-800 block py-2 px-3 outline-none border border-gray-300 bg-gray-100  rounded mb-3"
            />
            <input
              type="text"
              name="password"
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full text-gray-800 block py-2 px-3 outline-none border border-gray-300 bg-gray-100 rounded mb-2"
            />
            {state == "login" && (
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center">
                  <input type="checkbox" name="" id="check" className="mr-2" />
                  <label
                    htmlFor="check"
                    className="text-sm capitalize  text-gray-700 hover:text-gray-800 transition-all duration-300 cursor-pointer  font-medium"
                  >
                    remember me
                  </label>
                </div>
                <p className="text-sm capitalize text-gray-700 hover:text-gray-800 transition-all duration-300 cursor-pointer  font-medium">
                  <Link to={"/reset-password"}>forgot password?</Link>
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2 rounded text-white font-semibold my-2 cursor-pointer bg-linear-to-r from-blue-500 to-cyan-500 transition-all duration-300 capitalize"
            >
              {state}
            </button>
            <p className=" mt-2 text-sm font-medium text-gray-800">
              {state == "register"
                ? "Already have an account ?"
                : "Don't have an account ?"}
              <button
                type="button"
                className="cursor-pointer text-gray-700 underline hover:text-gray-800 transition-all duration-300 ml-1"
                onClick={() =>
                  setState(state == "register" ? "login" : "register")
                }
              >
                {state == "register" ? "Login" : "Register"}
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
