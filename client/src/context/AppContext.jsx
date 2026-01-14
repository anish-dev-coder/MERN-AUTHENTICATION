import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { createContext } from "react";
import { toast } from "react-toastify";

export const AuthContext = createContext();

const AppContext = ({ children }) => {
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userInfo, setUserInfo] = useState(false);
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const getAuthState = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/auth/is-auth");
      if (res.data.success) {
        setIsLoggedin(true);
        getUserInfo();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const getUserInfo = async () => {
    try {
      const res = await axios.get(backendUrl + "/api/user/user-data");
      if (res.data.success) {
        setUserInfo(res.data.userData);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getAuthState();
  }, []);
  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    getUserInfo,
    userInfo,
    setUserInfo,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AppContext;

export const useAuth = () => useContext(AuthContext);
