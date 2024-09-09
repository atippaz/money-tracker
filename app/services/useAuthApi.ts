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
    async register() {
      return await baseApi.getRequest(controllerName + "/register");
    },
    async logout() {
      return await baseApi.getRequest(controllerName + "/logout");
    },
  };
}
