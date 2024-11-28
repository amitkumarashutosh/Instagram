import Feed from "@/components/Feed";
import RightSidebar from "@/components/RightSidebar";
import useGetAllPost from "@/hooks/useGetAllPost";

const Home = () => {
  useGetAllPost();
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
