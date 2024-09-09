import useBaseApi from "./useBaseApi";
interface Profile {
  displayName: string;
  email: string;
  firstName: string;
  lastName: string;
  profile: string;
  userId: string;
  userName: string;
}
export default function useUserApi() {
  const baseApi = useBaseApi();
  const controllerName = "users";
  return {
    async getProfile() {
      try {
        const res = await baseApi.getRequest(controllerName + "/profile");
        return res as Profile;
      } catch (ex) {
        throw ex;
      }
    },
    async deactivate() {
      return await baseApi.getRequest(controllerName + "/deactivate");
    },
  };
}
