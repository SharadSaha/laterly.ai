import authApi from "@/services/auth";
import ArticleList from "../list";
import DashboardLayout from "./layout";
import { useEffect } from "react";

const Dashboard = () => {
  const [loginUser] = authApi.useLoginMutation();

  useEffect(() => {
    loginUser({
      email: "xKt2V@example.com",
      password: "password",
    });
  }, []);

  return (
    <DashboardLayout>
      <ArticleList />
    </DashboardLayout>
  );
};

export default Dashboard;
