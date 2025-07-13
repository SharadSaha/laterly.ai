import { LogIn, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Auth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  return (
    <Button
      variant="outline"
      className="flex items-center gap-2"
      onClick={() => setIsLoggedIn(!isLoggedIn)}
    >
      {isLoggedIn ? (
        <>
          <LogOut size={16} className="text-red-500" />
          Logout
        </>
      ) : (
        <>
          <LogIn size={16} className="text-green-500" />
          Login
        </>
      )}
    </Button>
  );
};

export default Auth;
