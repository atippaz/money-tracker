import useBaseApi from "./useBaseApi";
export default function useAuthApi() {
  const baseApi = useBaseApi();
  const controllerName = "auth";
  return {
    async login(credential: string, password: string) {
      return await baseApi.postRequest(controllerName + "/login", {
        credential: credential,
        password: password,
      });
    },
    async register({
      userName,
      email,
      firstName,
      lastName,
      password,
    }: {
      userName: string;
      email: string;
      firstName: string;
      lastName: string;
      password: string;
    }) {
      return await baseApi.postRequest(controllerName + "/register", {
        userName,
        email,
        firstName,
        lastName,
        password,
        profile: "",
      });
    },
    async logout() {
      return await baseApi.getRequest(controllerName + "/logout");
    },
  };
}
