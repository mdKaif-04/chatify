import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Avatar from "../component/Avatar";
import { useDispatch } from "react-redux";
import { setToken} from "../redux/userSlice";
import { PiUserCircle } from "react-icons/pi";

const CheckPasswordPage = () => {
  const [data, setData] = useState({
    password: "",
    userId: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!location?.state?.name) {
      navigate('/email');
    }
  });
  const handleOnchange = (e) => {
    
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/password`

    try {
      const response = await axios({
        method: "POST",
        url: URL,
        data: {
          userId: location?.state?._id,
          password: data.password,
        },
        withCredentials: true,
      });
      toast.success(response.data.message);

if (response.data.success) {
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);
        setData({
          password: "",
        });
        navigate('/');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  const userNAme = location?.state?.name;
  const userName = userNAme?.toUpperCase();
  return (
    <div className="mt-6 ">
      <div className="bg-white  w-full max-w-md  rounded overflow-hidden p-4 mx-auto">
        <div className="w-fit mx-auto mb-2 flex justify-center items-center flex-col  ">
          {/* <PiUserCircle size={75}/> */}
          <Avatar 
            width={70}
            height={70}
            name={location?.state?.name}
            imageUrl={location?.state?.profile_pic}
          />
          <h2 className="font-semibold text-lg bg-gradient-to-r from-common-purple to-secondary-dark bg-clip-text text-transparent select-none  ">
            {userName}
          </h2>
        </div>
        <h3 className="font-bold text-xl flex items-center justify-center bg-gradient-to-r from-primary-light to-primary-dark bg-clip-text text-transparent select-none">
          Welcome Back to&nbsp;
          <span className="text-2xl bg-gradient-to-r from-secondary-light to-secondary-dark bg-clip-text text-transparent">
            Chatify!!
          </span>
        </h3>
        <form className="grid gap-4 mt-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1 ">
            <label htmlFor="password">Password : </label>
            <input
              onChange={handleOnchange}
              type="password"
              name="password"
              className="bg-slate-100 px-2   py-1  focus:outline-primary-light rounded-sm "
              value={data.password}
              placeholder="enter your password"
              id="password"
              required
            />
          </div>

          <button className="bg-secondary-light hover:bg-secondary-dark font-bold text-lg cursor-pointer mt-3 tracking-wide leading-relaxed  h-12 rounded">
            Login
          </button>
        </form>
        <p className="text-sm mt-2 text-center hover:underline">
          <Link
            to={"/forgot-password"}
            className="bg-gradient-to-r from-primary-dark to-primary-light bg-clip-text text-transparent select-none text-md font-bold hover:underline  "
          >
            Forgot password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckPasswordPage;
