import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const Messages = ({ selectedUser }) => {
  return (
    <div className="overflow-y-auto flex-1 p-4">  
      <div className="flex justify-center">
        <div className="flex flex-col  items-center justify-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={selectedUser?.avatar} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span>{selectedUser?.username}</span>
          <Link to={`/profile/${selectedUser?._id}`}>
            <Button variant="secondary" className="mt-2 ">
              View profile
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {[1, 2, 3, 4].map((msg) => {
          return <div className={`flex`}>{msg}</div>;
        })}
      </div>
    </div>
  );
};

export default Messages;
