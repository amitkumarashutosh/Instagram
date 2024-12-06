import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useGetUserProfile from "@/hooks/useGetUserProfile";
import { AtSign } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const Profile = () => {
  const params = useParams();
  const userId = params.id;
  useGetUserProfile(userId);
  const [activeTab, setActiveTab] = useState("posts");

  const { userProfile } = useSelector((state) => state.auth);
  const isLoggedInUserProfile = false;
  const isFollowing = true;

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const displayPosts =
    activeTab === "posts" ? userProfile?.posts : userProfile?.bookmarks;
  return (
    <div className="flex max-w-4xl justify-center mx-auto pl-10">
      <div className="flex flex-col gap-20 p-8">
        <div className="grid grid-cols-2">
          <section className="flex items-center justify-center">
            <Avatar className="h-32 w-32">
              <AvatarImage src={userProfile?.avatar} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </section>
          <section>
            <div className="flex flex-col gap-5">
              <span>{userProfile?.username}</span>
              {isLoggedInUserProfile ? (
                <div className="flex gap-2">
                  <Button variant="secondary" className="hover:bg-gray-200 h-8">
                    Edit profile
                  </Button>
                  <Button variant="secondary" className="hover:bg-gray-200 h-8">
                    View archive
                  </Button>
                  <Button variant="secondary" className="hover:bg-gray-200 h-8">
                    Add tools
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2">
                  {isFollowing ? (
                    <>
                      <Button variant="secondary">Unfollow</Button>
                      <Button className="bg-[#0095F6] h-8 hover:bg-[#6cb6e7]">
                        Message
                      </Button>
                    </>
                  ) : (
                    <Button className="bg-[#0095F6] h-8 hover:bg-[#6cb6e7]">
                      Follow
                    </Button>
                  )}
                </div>
              )}
            </div>
            <div className="flex gap-4 mt-2">
              <p>
                {userProfile?.posts.length}{" "}
                <span className="font-semibold">posts</span>
              </p>
              <p>
                {userProfile?.followers.length}{" "}
                <span className="font-semibold">followers</span>
              </p>
              <p>
                {userProfile?.following.length}{" "}
                <span className="font-semibold">following</span>
              </p>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <span className="font-lights">
                {userProfile?.bio || "Bio here ..."}
              </span>
              <Badge className="w-fit" variant={"secondary"}>
                <AtSign /> <span className="pl-2">{userProfile?.username}</span>
              </Badge>
            </div>
          </section>
        </div>
        <div className="border-t border-t-gray-200">
          <div className="flex items-center justify-center gap-10 text-sm">
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "posts" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("posts")}
            >
              POSTS
            </span>
            <span
              className={`py-3 cursor-pointer ${
                activeTab === "saved" ? "font-bold" : ""
              }`}
              onClick={() => handleTabChange("saved")}
            >
              SAVED
            </span>
            <span className="py-3 cursor-pointer">REELS</span>
            <span className="py-3 cursor-pointer">TAGS</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {displayPosts.map((post) => {
              return (
                <div key={post._id} className="relative group cursor-pointer">
                  <img
                    src={post.image}
                    className="rounded-sm my-2  w-full aspect-square object-cover"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
