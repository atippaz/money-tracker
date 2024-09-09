import useBaseApi from "./useBaseApi";
interface SpendingTypeResponse {
  nameEn: string;
  nameTh: string;
  spendingTypeId: string;
}
export default function useSpendingTypeApi() {
  const baseApi = useBaseApi();
  const controllerName = "spending-types";
  return {
    async getAll() {
      return await baseApi.getRequest(controllerName);
    },
  };
}
