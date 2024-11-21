import Sidebar from "@/components/Sidebar";

const MainLayout = ({ children }) => {
  return (
    <div>
      <Sidebar />
      {children}
    </div>
  );
};

export default MainLayout;
