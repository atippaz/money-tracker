import useAuthApi from "~/services/useAuthApi";
// import { useRouter } from "next/navigation";
import { redirect, useNavigate } from "@remix-run/react";
export default function auth() {
  const authApi = useAuthApi();
  // useContextStore;!
  // const router = useRouter();
  // const context = useContexts()!;
  return {
    login: async (credential: string, password: string) => {
      try {
        const token = await authApi.login(credential, password);
        // localStorage.setItem("auth", token);
        // await context.refresh(true);
        // redirect("/homepage");
        // redirect("/homepage");
        return token;
      } catch {
        return null;
      }
    },
    register: async ({
      email,
      firstName,
      lastName,
      password,
      userName,
    }: {
      email: string;
      firstName: string;
      lastName: string;
      password: string;
      userName: string;
    }) => {
      try {
        const userId = await authApi.register({
          email,
          firstName,
          lastName,
          password,
          userName,
        });
        // localStorage.setItem("auth", token);
        // await context.refresh(true);
        // redirect("/homepage");
        // redirect("/homepage");
        return userId;
      } catch {
        return null;
      }
    },
    logout: async () => {
      try {
        // const token = await authApi.login(credential, password);
        // localStorage.removeItem("auth");
        // await context.refresh(true);

        redirect("/login");
      } catch {}
    },
  };
}
