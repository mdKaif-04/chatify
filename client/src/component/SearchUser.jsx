import React, { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import Loader from "./Loader";
import UserCard from "./UserCard";
import toast from "react-hot-toast";
import axios from "axios";
import { useEffect } from "react";
import { IoClose } from "react-icons/io5";

const SearchUser = ({onClose}) => {
  const [searchUser, setSearchUser] = useState([]);
  const [loading, setLoading] = useState(false);
   const [search, setSearch] = useState("")

  const handleSearchUser = async () => {

    const URL =  `${ import.meta.env.VITE_REACT_APP_BACKEND_URL }/api/search-user` 
    try {
      setLoading(true)
      const response = await axios.post(URL,{ search : search}) 
      setLoading(false)
      setSearchUser(response.data.data)
      
    } catch (error) {
      toast.error(error?.response?.data?.message)
      
    }
  }
  useEffect(() => {
    handleSearchUser()
  }, [search])

  console.log("search user",searchUser);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 bg-slate-900/70 p-2 z-10">
      <div className="w-full max-w-lg mx-auto mt-12">
        <div className="bg-white h-14 rounded-lg overflow-hidden flex">
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search user by Name, Email..."
            className="w-full  outline-none py-1 h-full px-4"
            onChange={(e) => setSearch(e.target.value)}
            value={search}
          />
          <div className="h-14 w-14 flex justify-center items-center">
            <IoSearchOutline size={25} />
          </div>
        </div>
        {/* display search user */}
        <div className="bg-white mt-2 w-full lg:max-h-[600px] p-4 h-screen  rounded overflow-x-hidden overflow-y-scroll scrollbar ">
          {/* if no user found */}
          {searchUser.length === 0 && !loading && (
            <p className="text-center text-sm font-semibold text-gray-700">
              No user found !!
            </p>
          )}
          {loading && (
            <p className="flex items-center justify-center">
              <Loader />
            </p>
          )}
          {
            searchUser.length !== 0 && (
                searchUser.map((user,index)=>{
                    return (
                        <UserCard key={user._id} user={user} onClose={onClose}/>
                    )
                })
            )
          }
        </div>
      </div>
      <div onClick={onClose} className="absolute top-0 right-0 text-2xl p-3  text-[#e8e8e8] cursor-pointer hover:bg-[#e8e8e8] hover:text-slate-700 rounded">
        <button>

        <IoClose  />
        </button>
      </div>
    </div>
  );
};

export default SearchUser;
