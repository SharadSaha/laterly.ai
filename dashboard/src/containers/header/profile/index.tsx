import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";

const ProfileDropdown = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer hover:ring-2 hover:ring-primary transition">
          <AvatarImage src="" alt="User" />
          <AvatarFallback className="bg-blue-100 text-blue-700">
            SS
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2 rounded-xl border shadow-md bg-white">
        <DropdownMenuLabel className="text-gray-500">
          My Account
        </DropdownMenuLabel>
        <div className="px-4 py-2 text-sm space-y-1">
          <p className="font-medium text-gray-900">Sharad Saha</p>
          <p className="text-gray-500">sharad@example.com</p>
          <p className="text-gray-400 text-xs">Joined: Feb 2024</p>
          <p className="text-gray-400 text-xs">Articles Saved: 122</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-600 hover:bg-red-50 flex items-center justify-between rounded-md px-3 py-2">
          <span>Logout</span>
          <LogOut className="h-4 w-4 text-red-600" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
