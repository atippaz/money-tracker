import useSpendingTypeApi from "~/services/useSpendingTypeApi";
import useSystemTagApi from "~/services/useTagApi";
import useUserApi from "~/services/useUserApi";
import React, { createContext, useContext, useState, useEffect } from "react";
import stateManager from "./StateManager";

interface Context {
  tags: [];

  spendingTypes: [];
  refresh: (redirecting?: boolean) => Promise<void>;
}
import { json } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";

// ฟังก์ชัน loader สำหรับ query ข้อมูลจาก server
export const loader = async ({ request }: { request: Request }) => {
  // Initialize API handlers
  const systemTagApi = useSystemTagApi();
  const spendingTypeApi = useSpendingTypeApi();
  const userApi = useUserApi();

  // Check for authentication token
  const accressToken = stateManager.getAccessTokenState(); // Replace with how you get the token server-side

  // Redirect if not authenticated
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

    return json({ spendingTypes, tags });
  } catch (error) {
    console.error("Failed to fetch dropdown data:", error);
    return json({ error: "Failed to fetch data" }, { status: 500 });
  }
};
const Provider = createContext<Context | null>(null);
export const ContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tags, setTags] = useState<[]>([]);
  const [spendingTypes, setspendingTypes] = useState<[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const refresh = async (redirecting: boolean = false) => {
    setLoading(true);

    setLoading(false);
  };
  useEffect(() => {
    stateManager.setAccessTokenState(localStorage.getItem("auth") || null);

    refresh();
  }, []);
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
  if (context === undefined) {
    throw new Error(
      "useDropdownCache must be used within a DropdownCacheProvider"
    );
  }
  return context;
};
