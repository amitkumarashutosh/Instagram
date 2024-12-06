import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Dialog, DialogContent } from "./ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { toast } from "sonner";
import { setPosts } from "@/app/features/postSlice";

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { user } = useSelector((state) => state.auth);
  const { selectedPost, posts } = useSelector((state) => state.post);
  const dispatch = useDispatch();
  const [comment, setComment] = useState([]);
  const changeHandler = (e) => {
    const inputText = e.target.value;
    setText(inputText);
  };

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const commentHandler = async () => {
    try {
      const res = await axios.post(
        `http://localhost:3000/api/v1/post/comment/${selectedPost._id}`,
        { text },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id
            ? { ...p, comments: updatedCommentData }
            : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent
        onInteractOutside={() => setOpen(false)}
        className="max-w-5xl p-0 flex flex-col"
      >
        <div className="flex flex-1">
          <div className="w-1/2">
            <img
              className="w-full h-full object-cover rounded-l-lg"
              src={selectedPost?.image}
            />
          </div>

          <div className="w-1/2 flex flex-col justify-between">
            <div className="flex items-center justify-between p-4">
              <div className="flex gap-3 items-center">
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.avatar} />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                  <Link className="font-semibold text-xs">
                    {selectedPost?.author?.username}
                  </Link>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <MoreHorizontal className="cursor-pointer" />
                </DialogTrigger>
                <DialogContent className="flex flex-col items-center text-sm text-center w-60">
                  <div className="cursor-pointer w-full text-[#ED4956] font-bold">
                    Unfollow
                  </div>
                  <div className="cursor-pointer w-full">Add to favourites</div>
                </DialogContent>
              </Dialog>
            </div>
            <hr />
            <div className="flex-1 overflow-y-auto max-h-96 p-4">
              {comment.map((comment) => (
                <Comment key={comment._id} comment={comment} />
              ))}
            </div>
            <div className="p-4 flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a commeny..."
                className="w-full outline-none border border-gray-300 p-2 rounded"
                onChange={changeHandler}
                value={text}
              />
              <Button
                variant="outline"
                onClick={commentHandler}
                disabled={!text.trim()}
              >
                Send
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CommentDialog;
