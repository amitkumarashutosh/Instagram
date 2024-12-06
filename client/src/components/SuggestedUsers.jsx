import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const SuggestedUsers = () => {
  const { suggestedUsers } = useSelector((state) => state.auth);
  return (
    <div className="my-10">
      <div className="flex items-center justify-between text-sm gap-2 mb-5">
        <h1 className="font-light text-gray-600 ">Suggested for you</h1>
        <span className="font-medium cursor-pointer">See all</span>
      </div>

      {suggestedUsers.map((user) => {
        return (
          <div key={user._id} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link to={`/profile/${user._id}`}>
                <Avatar>
                  <AvatarImage scr={user?.avatar} alt="post_image" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
              </Link>
              <div className="flex items-center gap-3">
                <h1 className="font-semibold text-sm">
                  <Link to={`/profile/${user._id}`}>{user?.username}</Link>
                </h1>
                <span className="text-gray-600 text-sm">
                  {user?.bio || "Bio here..."}{" "}
                </span>
              </div>
            </div>
            <span className="text-xs font-bold cursor-pointer text-[#3BADF8]">
              Follow
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default SuggestedUsers;
