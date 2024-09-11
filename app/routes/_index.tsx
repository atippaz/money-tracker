import { TypedResponse, type MetaFunction } from "@remix-run/node";
// import HomePage from "~/routes/homepage/_index";
// import Navbar from "~/components/layouts/Navbar";
export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

const Index = () => {
  return (
    <ContextProvider>
      <div className="flex h-full w-full flex-col">
        <Navbar />
        <div className="bg-slate-100 h-full w-full">
          <HomePage />
        </div>
        apsokd9so
      </div>
    </ContextProvider>
  );
};

export default Index;
import useSpendingTypeApi from "~/services/useSpendingTypeApi";
import useSystemTagApi from "~/services/useTagApi";
import useUserApi from "~/services/useUserApi";
import React, { createContext, useContext, useState, useEffect } from "react";
import stateManager from "~/contexts/StateManager";

interface Context {
  tags: [];

  spendingTypes: [];
  refresh: (redirecting?: boolean) => Promise<void>;
}
import { json, redirect, useLoaderData } from "@remix-run/react";
import { ResponseAction } from "~/interfaces/loader";
import { session } from "~/utils/cookie";
import Navbar from "~/components/layouts/Navbar";
import HomePage from "./homepage/_index";
import { X } from "lucide-react";

// ฟังก์ชัน loader สำหรับ query ข้อมูลจาก server
interface DataContext {
  tags: [];
  spendingTypes: [];
}
export const loader = async ({
  request,
}: {
  request: Request;
}): Promise<TypedResponse<ResponseAction<DataContext | null>>> => {
  // Initialize API handlers
  const systemTagApi = useSystemTagApi();
  const spendingTypeApi = useSpendingTypeApi();
  const userApi = useUserApi();
  const cookieHeader = request.headers.get("Cookie");
  const accressToken = await session.parse(cookieHeader);
  stateManager.setAccessTokenState(accressToken);
  if (!accressToken && new URL(request.url).pathname !== "/login") {
    return redirect("/login");
  }

  try {
    // Fetch data from APIs
    const [spendingTypes, userProfile, tags] = await Promise.all([
      spendingTypeApi.getAll(),
      accressToken ? userApi.getProfile() : null,
      systemTagApi.getByUser(true),
    ]);

    // Handle user profile if authenticated
    if (userProfile) {
      stateManager.setProfileState({
        displayName: userProfile.displayName,
        email: userProfile.email,
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        profile: userProfile.profile,
        userId: userProfile.userId,
        userName: userProfile.userName,
      });
    }
    return json({ data: { spendingTypes, tags }, status: 200 });
  } catch (error) {
    console.error("Failed to fetch dropdown data:", error);
    return json({ data: null, status: 400 });
  }
};
const Provider = createContext<Context | null>(null);
export const ContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const data = useLoaderData<ResponseAction<DataContext | null>>();
  const [tags, setTags] = useState<[]>([]);
  const [spendingTypes, setspendingTypes] = useState<[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const refresh = async (redirecting: boolean = false) => {
    setLoading(true);

    setLoading(false);
  };
  useEffect(() => {
    // stateManager.setAccessTokenState(localStorage.getItem("auth") || null);
    // refresh();
    if (!data.data) return;
    setTags((y) => [...y, ...data.data!.tags]);
    setspendingTypes((h) => [...h, ...data.data!.spendingTypes]);
    setLoading(false);
  }, [data]);
  return (
    <Provider.Provider
      value={{
        tags,
        spendingTypes,
        refresh,
      }}
    >
      {loading ? "loading" : children}
    </Provider.Provider>
  );
};

export const useContexts = () => {
  const context = useContext(Provider);
  console.log("skdsd", context);
  if (context === undefined) {
    throw new Error(
      "useDropdownCache must be used within a DropdownCacheProvider"
    );
  }
  return context;
};
