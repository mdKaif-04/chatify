import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft, FaPlus } from "react-icons/fa6";
import { FaImage, FaVideo } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import uploadFile from "../helpers/UploadFile";
import Loader from "./Loader";
import backgroundImage from "../assets/Dawn.jpg";
import { IoMdSend } from "react-icons/io";
import moment from "moment";
import { useRef } from "react";
const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );
  const user = useSelector(state => state?.user)
  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    profile_pic: "",
    online: false,
    _id: "",
  });
  const [openMediaBox, setOpenMediaBox] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMessage] = useState([]);
  const currentMsg = useRef(null);
  useEffect(() => {
    if (currentMsg.current) {
      currentMsg.current.scrollIntoView({ behaviour: "smooth", block: "end" });
    }
  }, [allMessage]);

  // console.log("params:", params.userId);

  const handleMediaBox = () => {
    setOpenMediaBox((prev) => !prev);
  };
  const handleUploadImage = async (e) => {
    const file = e.target.files[0];

    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenMediaBox(false);

    setMessage((preve) => {
      return {
        ...preve,
        imageUrl: uploadPhoto.secure_url,
      };
    });
  };
  const handleClearUploadImage = () => {
    setMessage((prev) => ({ ...prev, imageUrl: "" }));
  };
  const handleUploadVideo = async (e) => {
    const file = e.target.files[0];

    setLoading(true);
    const uploadPhoto = await uploadFile(file);
    setLoading(false);
    setOpenMediaBox(false);

    setMessage((preve) => {
      return {
        ...preve,
        videoUrl: uploadPhoto.secure_url,
      };
    });
  };
  const handleClearUploadVideo = () => {
    setMessage((prev) => ({ ...prev, videoUrl: "" }));
  };
  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params.userId);
      socketConnection.emit('seen',params.userId
        
      )
      socketConnection.on("message-user", (data) => {
        setDataUser(data);
      });
      // Add message to the chat component here
      socketConnection.on("message", (data) => {
        // console.log("messageData", data);
        setAllMessage(data);
      });

    }
  }, [socketConnection, params?.userId, user]);
  const handleOnchange = (e) => {
    const { name, value } = e.target;
    setMessage((prev) => {
      return {
        ...prev,
        text: value,
      };
    });
  };
  const handleSendMessage = (e) => {
    e.preventDefault();
    // e.stopPropagation();
    if (message.text || message.imageUrl || message.videoUrl) {
      if (socketConnection) {
        socketConnection.emit("new message", {
          sender: user?._id,
          receiver: params.userId,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          text: message.text,
          msgByUserId: user?._id,
        });
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        });
      }
    }
  };


  return (
    <div
      style={{ backgroundImage: `url(${backgroundImage})` }}
      className="bg-no-repeat md:bg-contain bg-cover"
    >
      <header className="sticky top-0 h-16 bg-amber-50 flex justify-between px-4 items-center">
        <div className="flex items-center gap-4">
          <Link to={"/"}>
            <FaAngleLeft size={25} className="lg:hidden" />
          </Link>
          <div className="my-1">
            <Avatar
              height={50}
              width={50}
              imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>
          <div>
            <h3 className=" font-semibold text-lg text-slate-800 my-0 text-ellipsis line-clamp-1">
              {dataUser?.name}
            </h3>
            {/* // dataUser.online? "Online" : "Last seen: " + new Date(dataUser.last_seen).toLocaleString() */}
            <p className=" -my-2">
              {dataUser.online ? (
                <span className="text-green-700">Online</span>
              ) : (
                <span className="text-gray-500">offline</span>
              )}
            </p>
          </div>
        </div>
        <div>
          <button className="cursor-pointer hover:text-green-900">
            <HiDotsVertical title="Details" size={24} />
          </button>
        </div>
      </header>
      {/* // all messages will be rendered here under this div tag. */}

      <section className="h-[calc(100vh-128px)] bg-slate-900/70  overflow-x-hidden overflow-y-scroll scrollBar relative ">
        {/* showing media */}

        {/* chats handles here */}

        <div className="flex flex-col py-2 gap-1 mx-2" ref={currentMsg}>
          {
          allMessage.map((msg, index) => {
            return (
              <div
                className={`bg-amber-100 my-1  rounded w-fit min-w-13 md:max-w-sm max-w-[250px] lg:max-w-md text-wrap break-all ${
                  user._id === msg?.msgByUserId
                    ? "ml-auto text-slate-700 "
                    : " bg-slate-400/40 text-amber-50"
                }`}
              >
                <div className="w-full ">
                  {msg?.imageUrl && (
                    <img
                      src={msg?.imageUrl.secure_url}
                      alt=""
                      className="w-full h-full object-scale-down "
                    />
                  )}

                  {msg?.videoUrl && (
                    <video
                      src={msg?.videoUrl.secure_url}
                      controls
                      className="w-full h-full object-scale-down "
                    />
                  )}
                </div>
                <p className=" font-medium px-2">{msg.text}</p>
                <p className="text-xs text-gray-900 ml-auto pb-1 pr-1 w-fit">
                  {moment(msg.createdAt).format("hh:mm")}
                </p>
              </div>
            );
          })}
        </div>
        {message.imageUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-500/60 flex justify-center items-center rounded overflow-hidden">
            <div
              onClick={handleClearUploadImage}
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-white text-slate-900"
            >
              <IoClose size={25} />
            </div>
            <div className="bg-white p-3">
              <img
                src={message.imageUrl.secure_url}
                alt="uploaded Image"
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
              />
            </div>
          </div>
        )}
        {/* for video */}
        {message.videoUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-500/60 flex justify-center items-center rounded overflow-hidden">
            <div
              onClick={handleClearUploadVideo}
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-white text-slate-900"
            >
              <IoClose size={25} />
            </div>
            <div className="bg-white p-3">
              <video
                src={message.videoUrl.secure}
                className="aspect-square w-full h-full max-w-sm m-2 object-scale-down"
                controls
                muted
                autoPlay
              />
            </div>
          </div>
        )}
        {loading && (
          <div className="w-full h-full sticky bottom-0 flex justify-center items-center">
            <Loader />
          </div>
        )}
      </section>
      {/* // send message */}
      <section className="bg-amber-50 h-16 flex items-center">
        <div className="relative ">
          <button
            onClick={handleMediaBox}
            className="flex  justify-center items-center w-10 h-10  hover:bg-slate-800 hover:text-white rounded-full"
          >
            <FaPlus size={20} className=" " />
          </button>
          {/* media box popup */}
          {openMediaBox && (
            <div className="bg-slate-400 shadow rounded absolute bottom-14 ml-2 w-36 p-2">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center p-2 gap-3 hover:bg-slate-700 rounded hover:text-white cursor-pointer hover:font-semibold"
                >
                  <div className="text-primary">
                    <FaImage size={18} />
                  </div>
                  <p>Image</p>
                </label>
                <label
                  htmlFor="uploadVideo"
                  className="flex items-center p-2 gap-3 hover:bg-slate-700 rounded hover:text-white cursor-pointer hover:font-semibold"
                >
                  <div className="">
                    <FaVideo size={18} />
                  </div>
                  <p>Video</p>
                </label>

                <input
                  type="file"
                  id="uploadImage"
                  onChange={handleUploadImage}
                  className="hidden"
                />

                <input
                  type="file"
                  id="uploadVideo"
                  onChange={handleUploadVideo}
                  className="hidden"
                />
              </form>
            </div>
          )}
        </div>
        {/* input box for message sending */}
        <form
          onSubmit={handleSendMessage}
          className="h-full w-full flex gap-2 items-center jus"
        >
          <input
            type="text"
            placeholder="Message..."
            className="py-1 px-4 outline-none w-full h-full "
            value={message.text}
            onChange={handleOnchange}
          />
          <button className="lg:mr-17 mr-3 text-slate-800  w-12 hover:text-green-800 cursor-pointer hover:animate-bounce  h-11 flex justify-center items-center">
            <IoMdSend size={28} />
          </button>
        </form>
      </section>
    </div>
  );
};

export default MessagePage;
