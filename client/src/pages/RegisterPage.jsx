import React, { useState } from "react";
import { IoClose } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import uploadFile from "../helpers/UploadFile";
import axios from 'axios';
import toast from "react-hot-toast";

const RegisterPage = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    profile_pic: "",
  })
  
  const [UploadPhoto, setUploadPhoto] = useState("");
  const navigate = useNavigate()
  
  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };
  const handleUploadPhoto = async (e) => {
    const file = e.target.files[0]
    const uploadPhoto = await uploadFile(file);
    setUploadPhoto(file)
    setData((prev) => {
      return {
       ...prev,
        profile_pic: uploadPhoto?.url,
      }
    })
  }
  const handleClearPhoto = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setUploadPhoto(null);
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/api/register`
    try {
      const  response = await axios.post(URL, data)
      toast.success("User registered successfully")
      if(response.data.success) {
        setData({
          name: "",
          email: "",
          password: "",
          profile_pic: "",
        })
        navigate('/email')
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  return (
    <div className="mt-6 ">
      <div className="bg-white  w-full max-w-sm  rounded overflow-hidden p-4 mx-auto">
        <h3 className="font-bold text-2xl text-primary-dark select-none">
          Welcome to Chatify!!
        </h3>
        <form className="grid gap-4 mt-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1 ">
            <label htmlFor="name">Name : </label>
            <input
              onChange={handleOnchange}
              type="text"
              name="name"
              className="bg-slate-100 px-2   py-1  focus:outline-primary-light rounded-sm "
              value={data.name}
              placeholder="enter your name"
              id="name"
              required
            />
          </div>
          <div className="flex flex-col gap-1 ">
            <label htmlFor="email">Email : </label>
            <input
              onChange={handleOnchange}
              type="email"
              name="email"
              className="bg-slate-100 px-2   py-1  focus:outline-primary-light rounded-sm "
              value={data.email}
              placeholder="enter your email"
              id="email"
              required
            />
          </div>
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
          <div className="flex flex-col gap-1 ">
            <label htmlFor="profile_pic">
              Profile pic :
              <div className="h-14 bg-slate-200 flex justify-center items-center hover:border cursor-pointer hover:border-primary-light ">
                <p className="text-sm max-w[300px] text-ellipsis line-clamp-1">
                  {UploadPhoto?.name
                    ? UploadPhoto?.name
                    : "Upload profile picture "}
                </p>
                {UploadPhoto?.name && (
                  <button
                    className=" text-lg ml-2 cursor-pointer hover:text-red-600 "
                    onClick={handleClearPhoto}
                  >
                    <IoClose />
                  </button>
                )}
              </div>
            </label>
            <input
              type="file"
              name="profile_pic"
              id="profile_pic"
              className="bg-slate-100 px-2   py-1  focus:outline-primary-light rounded-sm hidden "
              onChange={handleUploadPhoto}
            />
          </div>
          
          <button  className="bg-secondary-light hover:bg-secondary-dark font-bold text-lg cursor-pointer mt-3 tracking-wide leading-relaxed  h-12 rounded">Register</button>
        </form>
        <p className="text-sm mt-2 text-center">Already have an account? <Link to={"/email"} className="text-secondary-light text-md font-bold hover:underline  ">  Login Here   </Link></p>
      </div>
    </div>
  );
};

export default RegisterPage;
