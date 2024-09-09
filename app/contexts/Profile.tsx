import React, { createContext, useContext, useState, useEffect } from "react";

interface Context {
  accressToken: string;
  refresh: () => Promise<void>;
}

const Provider = createContext<Context | null>(null);
export const SecureProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [accressToken, setAccressToken] = useState(
    localStorage.getItem("auth") || ""
  );

  const refresh = async () => {
    try {
      console.log("s");
    } catch (error) {
      console.error("Failed to fetch dropdown data:", error);
    }
  };

  return (
    <Provider.Provider
      value={{
        refresh,
        accressToken,
      }}
    >
      {children}
    </Provider.Provider>
  );
};

export const useSecure = () => {
  const context = useContext(Provider);
  if (context === undefined) {
    throw new Error(
      "useDropdownCache must be used within a DropdownCacheProvider"
    );
  }
  return context;
};
