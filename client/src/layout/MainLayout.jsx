import LeftSidebar from "@/components/LeftSidebar";

const MainLayout = ({ children }) => {
  return (
    <div>
      <LeftSidebar />
      {children}
    </div>
  );
};

export default MainLayout;
