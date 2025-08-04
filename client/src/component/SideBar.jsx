import React, { useState } from "react";
import { IoChatbubbleEllipses } from "react-icons/io5";
import { FaUserPlus } from "react-icons/fa";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import Avatar from "./Avatar";
import { useDispatch, useSelector } from "react-redux";
import EditUserDetails from "./EditUserDetails";
import { GoArrowUpLeft } from "react-icons/go";
import SearchUser from "./SearchUser";
import { useEffect } from "react";
import { FaImage, FaVideo } from "react-icons/fa6";
import { logout } from "../redux/userSlice";


const SideBar = () => {
  const user = useSelector((state) => state?.user);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [allUser, setAllUser] = useState([]);
  const [openSearchUser, setOpenSearchUser] = useState(false);
  const socketConnection = useSelector((state) => state?.user?.socketConnection );
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user._id);
      socketConnection.on("conversation", (data) => {
        console.log("conversation ", data);
        const conversationUserData = data.map((conversationUser, index) => {
          if (
            conversationUser?.sender?._id === conversationUser?.receiver?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          } else if (conversationUser?.receiver?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          }
        });
        setAllUser(conversationUserData);
      });
    }
  }, [socketConnection, user]);

  const handleLogout = ()=>{
    dispatch(logout())
    navigate('/email')
    localStorage.clear()
    
  }

  return (
    <div className="w-full h-full grid grid-cols-[48px_1fr] ">
      <div className="bg-slate-900 w-12 h-full rounded-tr-lg rounded-br-lg text-slate-400 py-5 flex flex-col justify-between">
        <div>
          <NavLink
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center hover:cursor-pointer hover:text-slate-900 hover:bg-slate-300 rounded ${isActive}&& bg-slate-200 text-slate-900`
            }
            title="chat"
          >
            <IoChatbubbleEllipses size={23} />
          </NavLink>
          <div
            onClick={() => setOpenSearchUser(true)}
            className="mt-2 w-12 h-12 flex justify-center items-center hover:cursor-pointer hover:text-slate-900 hover:bg-slate-300 rounded"
            title="add friend"
          >
            <FaUserPlus size={23} />
          </div>
        </div>
        <div className="flex flex-col items-center ">
          <button
            className=" w-12 h-12 flex justify-center items-center hover:cursor-pointer hover:text-slate-900 hover:bg-slate-300 rounded"
            title="Edit Profile"
            onClick={setEditUserOpen}
          >
            <Avatar
              width={40}
              height={40}
              name={user?.name}
              imageUrl={user?.profile_pic}
              userId={user?._id}
            />
          </button>
          <button
            className=" w-12 h-12 flex justify-center items-center hover:cursor-pointer hover:text-slate-900 hover:bg-slate-300 rounded-full"
            title="logOut"
            onClick={handleLogout}
          >
            <span className="-ml-2.5">
              <BiLogOut size={23} />
            </span>
          </button>
        </div>
      </div>
      <div className="w-full lg:max-w-[320px]  ">
        <div className="h-16 flex items-center">
          <h2 className="font-bold p-4 text-slate-700  text-xl">Message</h2>
        </div>
        <div className="bg-slate-300 p-[0.5px]"></div>
        <div className=" h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollBar">
          {allUser.length === 0 && (
            <div className="mt-12">
              <Link to={'/email'} className="bg-slate-600 hover:bg-slate-800 text-white font-bold w-fit mx-auto rounded px-3 justify-center flex h-10 items-center mt-5">Login </Link>
              <div className="flex items-center justify-center my-4 text-slate-600 hover:text-slate-800">
                <GoArrowUpLeft size={50} />
              </div>
              <p className="text-lg text-center text-slate-600">
                please Login to start a conversation
              </p>
            </div>
            
          )}
          {allUser.map((conv, index) => {
            return (
              <NavLink to={"/"+conv?.userDetails?._id}
                key={conv?._id}
                className="flex items-center gap-2  border border-transparent border-b-slate-300  py-2 lg:max-w-[272px] hover:bg-slate-200"
              >
                <div>
                  <Avatar
                    imageUrl={conv?.userDetails?.profile_pic}
                    name={conv?.userDetails?.name}
                    height={40}
                    width={40}
                  />
                </div>
                <div>
                  <h3 className="text-ellipsis line-clamp-1 text-base text-slate-700 font-semibold">
                    {conv?.userDetails?.name}
                  </h3>
                  <div className="text-slate-500 text-xs flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      {conv?.lastMsg?.imageUrl && (
                        <div className="flex items-center gap-1">
                          <span><FaImage /></span>
                          {!conv?.lastMsg?.text && <span>photo</span>}
                        </div>
                      )
                      }

                      {conv?.lastMsg?.imageUrl && (
                        <div className="flex items-center gap-1">
                          <span><FaVideo /></span>
                          {!conv?.lastMsg?.text && <span>Video</span>}
                        </div>
                      )}
                    </div>
                    <p className="text-ellipsis line-clamp-1 " >{conv?.lastMsg?.text}</p>
                  </div>
                </div>
                {
                  Boolean(conv?.unseenMsg) && (
                    <p className="lg:text-x p-1 bg-slate-700 flex items-center justify-center text-amber-50 font-bold rounded-full lg:w-6 lg:h-6 w-5 h-5 text-xs ml-auto">{conv?.unseenMsg}</p>
                    
                  )
                }
              </NavLink>
            );
          })}
        </div>
      </div>
      {/* edit user details */}
      {editUserOpen && (
        <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}

      {/* search user */}
      {openSearchUser && (
        <SearchUser onClose={() => setOpenSearchUser(false)} />
      )}
    </div>
  );
};

export default SideBar;
