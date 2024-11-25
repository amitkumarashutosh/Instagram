import Feed from "@/components/Feed";
import RightSidebar from "@/components/RightSidebar";

const Home = () => {
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
