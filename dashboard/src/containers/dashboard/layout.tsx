import { Separator } from "@/components/ui/separator";
import Sidebar from "../sidebar";
import Header from "../header";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col bg-background">
        <Header />
        <Separator />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
