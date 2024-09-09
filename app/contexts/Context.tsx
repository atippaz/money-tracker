import useSpendingTypeApi from "~/services/useSpendingTypeApi";
import useSystemTagApi from "~/services/useTagApi";
import useUserApi from "~/services/useUserApi";
import React, { createContext, useContext, useState, useEffect } from "react";
import stateManager from "./StateManager";
import { redirect, useRoutes } from "@remix-run/react";

interface Context {
  tags: [];

  spendingTypes: [];
  refresh: (redirecting?: boolean) => Promise<void>;
}

const Provider = createContext<Context | null>(null);
export const ContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [tags, setTags] = useState<[]>([]);
  const [spendingTypes, setspendingTypes] = useState<[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const refresh = async (redirecting: boolean = false) => {
    setLoading(true);
    // if (
    //   (window.location.pathname == "/login" && !redirecting) ||
    //   window.location.pathname == "/register"
    // ) {
    //   setLoading(false);
    //   return;
    // }
    try {
      let accressToken: string | null = stateManager.getAccessTokenState();

      const systemTagApi = useSystemTagApi();
      const spendingTypeApi = useSpendingTypeApi();
      const types = await spendingTypeApi.getAll();

      setspendingTypes((x) => types);
      const userApi = useUserApi();
      try {
        if (accressToken != null) {
          const res = await userApi.getProfile();
          stateManager.setProfileState({
            displayName: res.displayName,
            email: res.email,
            firstName: res.firstName,
            lastName: res.lastName,
            profile: res.profile,
            userId: res.userId,
            userName: res.userName,
          });
        } else {
          throw new Error("not authen");
        }
      } catch (er) {
        if (window.location.pathname != "/login") {
          window.location.href = "/login";
        }
      }
      const tags = await systemTagApi.getByUser(true);

      setTags((x) => tags);
      // router("/homepage");
    } catch (error) {
      console.error("Failed to fetch dropdown data:", error);
    }
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
