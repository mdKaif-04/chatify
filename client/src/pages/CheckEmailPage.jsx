import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import toast from "react-hot-toast";
import { PiUserCircle } from "react-icons/pi";

const CheckEmailPage = () => {
    const [data, setData] = useState({
    email: "",
   
  })
  
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const URL = `${import.meta.env.VITE_REACT_APP_BACKEND_URL }/api/email`
    try {
      const  response = await axios.post(URL, data)
      toast.success("Email verified successfully! ")
      if(response.data.success) {
        setData({
          email: "",
         
        })
        navigate('/password',{
          state : response?.data?.data
        })
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
  }
  return (
      <div className="mt-6 ">
          <div className="bg-white  w-full max-w-sm  rounded overflow-hidden p-4 mx-auto">
            <div className="w-fit mx-auto mb-2 text-slate-800">
              <PiUserCircle size={75}  />
              
            </div>
             <h3 className="font-bold text-xl flex items-center justify-center bg-gradient-to-r from-primary-light to-primary-dark bg-clip-text text-transparent select-none">
          Welcome Back to&nbsp;
          <span className="text-2xl bg-gradient-to-r from-secondary-light to-secondary-dark bg-clip-text text-transparent">
            Chatify!!
          </span>
        </h3>
            <form className="grid gap-4 mt-4" onSubmit={handleSubmit}>
             
              
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
            
                
               
              
              <button  className="bg-secondary-light hover:bg-secondary-dark font-bold text-lg cursor-pointer mt-3 tracking-wide leading-relaxed  h-12 rounded">Next</button>
            </form>
            <p className="text-sm mt-2 text-center">Don't have an account? <Link to={"/register"} className="text-secondary-light text-md font-bold hover:underline  ">  SignUp Here   </Link></p>
          </div>
        </div>
  )
}

export default CheckEmailPage