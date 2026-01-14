import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true;

const Header = () => {
  const { userInfo, setIsLoggedin, setUserInfo, backendUrl } = useAuth();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const res = await axios.post(backendUrl + "/api/auth/logout");
      if (res.data.success) {
        setIsLoggedin(false);
        setUserInfo(null);
        toast.success(res.data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const sentEmailVerify = async () => {
    try {
      const res = await axios.post(backendUrl + "/api/auth/send-verify-otp");
      if (res.data.success) {
        navigate("/email-verify");
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="z-20 bg-white fixed top-0 w-full flex items-center justify-between px-3 md:px-10 py-4 ">
      <div className="">
        <h1 className="text-2xl text-teal-700 font-semibold">🔒 Auth System</h1>
      </div>

      {userInfo ? (
        <div className="w-8 h-8 bg-gray-900 text-white rounded-full flex justify-center items-center relative group cursor-pointer">
          {userInfo.name[0].toUpperCase()}
          <div className="absolute top-0 right-0 m-0 pt-10 z-10 text-gray-800 ">
            <ul className="list-none bg-white  border border-gray-500 m-0 py-1 px-2  text-sm rounded  hidden group-hover:block ">
              {!userInfo.isVerified && (
                <li
                  onClick={sentEmailVerify}
                  className="py-1 px-2 cursor-pointer capitalize text-nowrap"
                >
                  verify email
                </li>
              )}
              <li
                onClick={logout}
                className="py-1 px-2 cursor-pointer capitalize text-nowrap"
              >
                Logout
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <button
          className="text-gray-700 py-1 px-4 rounded-2xl font-medium transition-all duration-300 cursor-pointer border border-gray-300"
          onClick={() => navigate("/login")}
        >
          Login +
        </button>
      )}
    </div>
  );
};

export default Header;
