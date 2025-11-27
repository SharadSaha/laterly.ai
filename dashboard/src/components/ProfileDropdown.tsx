import { LogOut, Mail, User2, CalendarCheck, Bookmark } from "lucide-react";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useAppDispatch, useAppSelector } from "../app/store/hooks";
import { useLogoutMutation } from "../app/services/authApi";
import { clearAuth } from "../app/store";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { formatDate } from "../utils/format";

const ProfileDropdown = () => {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logout, { isLoading }] = useLogoutMutation();

  const initials = user?.name ? user.name[0] : user?.email?.[0] ?? "U";

  const handleLogout = async () => {
    try {
      await logout().unwrap();
    } finally {
      dispatch(clearAuth());
      toast("Signed out");
      navigate("/login");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/70 px-2 py-1 pr-3 shadow-sm hover:shadow"
          aria-label="Profile menu"
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold leading-tight text-slate-900 dark:text-slate-50">{user?.name ?? "Guest"}</p>
            <p className="text-xs text-slate-500">{user?.email ?? "Not signed in"}</p>
          </div>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-50">{user?.name ?? "Laterly user"}</p>
              <p className="text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2 text-slate-700 dark:text-slate-200">
          <User2 className="h-4 w-4" />
          Joined {formatDate(user?.joinedOn)}
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 text-slate-700 dark:text-slate-200">
          <Mail className="h-4 w-4" />
          {user?.email ?? "Pending"}
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 text-slate-700 dark:text-slate-200">
          <Bookmark className="h-4 w-4" />
          Bookmarked {user?.stats?.bookmarked ?? 0}
        </DropdownMenuItem>
        <DropdownMenuItem className="gap-2 text-slate-700 dark:text-slate-200">
          <CalendarCheck className="h-4 w-4" />
          Opened {user?.stats?.opened ?? 0}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="gap-2 text-red-500 focus:bg-red-50" aria-label="Logout">
          <LogOut className="h-4 w-4" />
          {isLoading ? "Signing out…" : "Logout"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ProfileDropdown;
