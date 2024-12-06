import { AvatarFallback } from "@radix-ui/react-avatar";
import { Avatar, AvatarImage } from "./ui/avatar";

const Comment = ({ comment }) => {
  return (
    <div className="my-2">
      <div className="flex gap-3 items-center">
        <Avatar>
          <AvatarImage src={comment?.author?.avatar} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <div className="font-bold text-sm">
          {comment?.author?.username}{" "}
          <span className="text-sm font-light pl-1">{comment.text}</span>
        </div>
      </div>
    </div>
  );
};

export default Comment;
