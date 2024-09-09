import useAuthApi from "~/services/useAuthApi";
// import { useRouter } from "next/navigation";
import { useContexts } from "~/contexts/Context";
import { redirect, useNavigate } from "@remix-run/react";
export default function auth() {
  const authApi = useAuthApi();
  // useContextStore;!
  // const router = useRouter();
  const navigate = useNavigate();
  const context = useContexts()!;
  return {
    login: async (credential: string, password: string) => {
      try {
        const token = await authApi.login(credential, password);
        localStorage.setItem("auth", token);
        await context.refresh(true);
        // redirect("/homepage");
        navigate("/homepage");
      } catch {}
    },
    logout: async () => {
      try {
        // const token = await authApi.login(credential, password);
        localStorage.removeItem("auth");
        // await context.refresh(true);

        navigate("/login");
      } catch {}
    },
  };
}
