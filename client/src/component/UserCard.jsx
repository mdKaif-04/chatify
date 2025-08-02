import React from "react";
import Avatar from "./Avatar";
import { Link } from "react-router-dom";

const UserCard = ({ user , onClose}) => {
  return (
    <Link to={"/"+user?._id} onClick={onClose} className="flex items-center gap-3 mt-2 pb-1  border border-transparent  rounded lg:p-3 hover:bg-slate-200 cursor-pointer border-b-slate-300">
      <div className="">
        <Avatar width={50} height={50} name={user?.name} userId={user?._id} imageUrl={user?.profile_pic} />
      </div>
      <div >
        <div className="font-bold text-slate-700 text-ellipsis line-clamp-1">
          <h3>{user?.name}</h3>
        </div>
        <p className="text-ellipsis line-clamp-1">{user?.email}</p>
      </div>
    </Link>
  );
};

export default UserCard;
