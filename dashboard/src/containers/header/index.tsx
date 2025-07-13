import { Input } from "@/components/ui/input";
import Auth from "./auth";
import Profile from "./profile";

const Header = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b bg-background/50">
      <div className="flex gap-2 items-center w-1/2">
        <Input placeholder="Search articles..." className="flex-1" />
      </div>
      <div className="flex items-center space-x-4">
        <Auth />
        <Profile />
      </div>
    </header>
  );
};

export default Header;
