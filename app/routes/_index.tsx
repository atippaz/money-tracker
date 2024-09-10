import { redirect, type MetaFunction } from "@remix-run/node";
// import HomePage from "~/routes/homepage/_index";
// import Navbar from "~/components/layouts/Navbar";
import { Navigate, useNavigate } from "@remix-run/react";
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const Index = () => {
  return (
    <div className="flex h-full w-full flex-col">
      {/* <Navbar /> */}
      <div className="bg-slate-100 h-full w-full">{/* <HomePage /> */}</div>
    </div>
  );
};

export default Index;
