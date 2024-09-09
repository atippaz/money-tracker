import useBaseApi from "./useBaseApi";
export default function useTagApi() {
  const baseApi = useBaseApi();
  const controllerName = "tags";
  return {
    async getAll() {
      return await baseApi.getRequest(controllerName);
    },
    async getByUser(hasSystem: boolean = false) {
      return await baseApi.getRequest(
        controllerName + `?hasSystem=${hasSystem}`
      );
    },
    async create() {
      return await baseApi.getRequest(controllerName);
    },
  };
}
