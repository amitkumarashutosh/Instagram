import Feed from "@/components/Feed";
import RightSidebar from "@/components/RightSidebar";
import useGetAllPost from "@/hooks/useGetAllPost";
import useGetSuggestedUsers from "@/hooks/useGetSuggestedUsers";

const Home = () => {
  useGetAllPost();
  useGetSuggestedUsers();
  return (
    <div>
      <div className="flex">
        <div className="flex-grow">
          <Feed />
        </div>
        <RightSidebar />
      </div>
    </div>
  );
};

export default Home;
