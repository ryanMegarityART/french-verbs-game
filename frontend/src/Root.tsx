import React, { useEffect, useState } from "react";
import { AppNavigation } from "./components/AppNavigation";
import { Outlet } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";

export interface User {
  id: number;
  email: string;
  username: string;
}

export const Root = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User>();
  const location = useLocation();

  useEffect(() => {
    if (!user) {
      const userCache = localStorage.getItem("user");
      if (userCache) {
        return setUser(JSON.parse(userCache));
      }
      if (location.pathname != "/register") {
        navigate("/sign-in");
      }
    }
  }, [user]);

  return (
    <div className="app">
      {user && <AppNavigation />}
      <Outlet context={[user, setUser]} />
    </div>
  );
};
